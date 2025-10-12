import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, AlertCircle, RefreshCw, Copy, Check } from "lucide-react";
import { serviceOrderApi } from "../services/serviceOrderApi";
import { orderApi, Order } from "../services/orderApi";

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [orderType, setOrderType] = useState<'service_order' | 'ecommerce_order' | 'apartment_booking' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [backendResponse, setBackendResponse] = useState<any>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [orderStatus, setOrderStatus] = useState<string>('');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [webhookTimeline, setWebhookTimeline] = useState<Array<{timestamp: Date, event: string, status: 'success' | 'error' | 'pending'}>>([]);
  const [requestPayload, setRequestPayload] = useState<any>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [apiCallDuration, setApiCallDuration] = useState<number>(0);

  const txRef = searchParams.get('tx_ref');
  const status = searchParams.get('status');
  const transactionId = searchParams.get('transaction_id');
  const type = searchParams.get('type'); // Get type from URL params

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);
    setDebugLogs(prev => [...prev, logEntry]);
  };

  const addTimelineEvent = (event: string, status: 'success' | 'error' | 'pending') => {
    setWebhookTimeline(prev => [...prev, { timestamp: new Date(), event, status }]);
  };

  const pollOrderStatus = async (orderIdToCheck: number, orderTypeToCheck: string) => {
    addLog(`Starting to poll order status for order #${orderIdToCheck}`);
    setIsPolling(true);

    let attempts = 0;
    const maxAttempts = 5;
    const interval = 2000;

    const checkStatus = async (): Promise<boolean> => {
      attempts++;
      addLog(`Polling attempt ${attempts}/${maxAttempts}`);

      try {
        if (orderTypeToCheck === 'ecommerce_order') {
          const order = await orderApi.getOrderById(orderIdToCheck);
          addLog(`Current order status: ${order.status}`);
          setOrderStatus(order.status);

          if (order.status === 'paid') {
            addLog('✓ Order status confirmed as PAID!');
            setConfirmationStatus('success');
            return true;
          }
        }

        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, interval));
          return checkStatus();
        } else {
          addLog('Max polling attempts reached. Status not updated to paid.');
          return false;
        }
      } catch (error: any) {
        addLog(`Error polling order status: ${error.message}`);
        return false;
      }
    };

    const success = await checkStatus();
    setIsPolling(false);
    return success;
  };

  const confirmPayment = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    setBackendResponse(null);

    addLog('=== Starting Payment Confirmation ===');
    addLog(`Transaction Reference: ${txRef}`);
    addLog(`Payment Status: ${status}`);
    addLog(`Transaction ID: ${transactionId}`);
    addLog(`Type from URL: ${type}`);

    try {
      let extractedOrderId: number | null = null;
      let detectedType: 'service_order' | 'ecommerce_order' | 'apartment_booking' = 'service_order';

      if (type === 'ecommerce' || txRef.includes('ecommerce_order_') || txRef.includes('order_')) {
        detectedType = 'ecommerce_order';
        const match = txRef.match(/(?:ecommerce_order_|order_)(\d+)/);
        if (match) extractedOrderId = parseInt(match[1]);
        addLog(`Detected type: E-commerce order, Order ID: ${extractedOrderId}`);
      } else if (type === 'apartment' || txRef.includes('apartment_booking_') || txRef.includes('booking_')) {
        detectedType = 'apartment_booking';
        const match = txRef.match(/(?:apartment_booking_|booking_)(\d+)/);
        if (match) extractedOrderId = parseInt(match[1]);
        addLog(`Detected type: Apartment booking, Booking ID: ${extractedOrderId}`);
      } else if (type === 'service' || txRef.includes('service_order_')) {
        detectedType = 'service_order';
        const match = txRef.match(/service_order_(\d+)/);
        if (match) extractedOrderId = parseInt(match[1]);
        addLog(`Detected type: Service order, Order ID: ${extractedOrderId}`);
      } else if (txRef.includes('flw_')) {
        const match = txRef.match(/flw_(\d+)/);
        if (match) extractedOrderId = parseInt(match[1]);
        addLog(`Detected order ID from flw_ prefix: ${extractedOrderId}`);
      } else {
        const match = txRef.match(/(\d+)/);
        if (match) extractedOrderId = parseInt(match[1]);
        addLog(`Extracted order ID from any number: ${extractedOrderId}`);
      }

      setOrderType(detectedType);
      setOrderId(extractedOrderId);

      if (!extractedOrderId) {
        const errorMsg = `Could not extract order ID from tx_ref: ${txRef}`;
        addLog(`ERROR: ${errorMsg}`);
        setErrorMessage(errorMsg);
        setConfirmationStatus('error');
        setIsProcessing(false);
        return;
      }

      const payload = {
        data: {
          status: 'successful',
          tx_ref: txRef,
          transaction_id: transactionId,
          meta: {
            type: detectedType,
            order_id: extractedOrderId,
            service_order_id: detectedType === 'service_order' ? extractedOrderId : undefined
          }
        }
      };

      setRequestPayload(payload);
      addLog('=== Sending Payload to Backend ===');
      addLog(JSON.stringify(payload, null, 2));
      addTimelineEvent('Preparing webhook payload', 'success');

      let response: any;
      const apiCallStart = Date.now();
      setWebhookStatus('sending');
      addTimelineEvent('Sending POST to /api/flutterwave/manual-trigger', 'pending');

      if (detectedType === 'ecommerce_order') {
        addLog('Calling orderApi.manualPaymentTrigger...');
        response = await orderApi.manualPaymentTrigger(payload);
      } else if (detectedType === 'service_order') {
        addLog('Calling serviceOrderApi.manualPaymentTrigger...');
        response = await serviceOrderApi.manualPaymentTrigger(payload);
      } else {
        addLog('Apartment booking - payment confirmation not implemented yet');
        setConfirmationStatus('success');
        setIsProcessing(false);
        return;
      }

      const duration = Date.now() - apiCallStart;
      setApiCallDuration(duration);
      addLog(`API call completed in ${duration}ms`);
      setWebhookStatus('sent');
      addTimelineEvent(`Received response in ${duration}ms`, 'success');

      addLog('=== Backend Response ===');
      addLog(JSON.stringify(response, null, 2));
      setBackendResponse(response);
      setResponseData(response);

      if (response && (response.status === 'success' || response.message)) {
        addLog('✓ Backend returned success response');

        if (detectedType === 'ecommerce_order') {
          addLog('Starting order status polling...');
          await pollOrderStatus(extractedOrderId, detectedType);
        } else {
          setConfirmationStatus('success');
        }
      } else {
        addLog('⚠ Backend response does not indicate success');
        setConfirmationStatus('success');
      }

    } catch (error: any) {
      const errorMsg = error.message || 'Unknown error occurred';
      setWebhookStatus('failed');
      addTimelineEvent(`Webhook failed: ${errorMsg}`, 'error');
      addLog(`=== ERROR ===`);
      addLog(`Error Type: ${error.name}`);
      addLog(`Error Message: ${errorMsg}`);
      addLog(`Full Error: ${JSON.stringify(error, null, 2)}`);

      setErrorMessage(errorMsg);
      setConfirmationStatus('error');
      setBackendResponse({ error: errorMsg, details: error });
      setResponseData({ error: errorMsg, details: error });
    } finally {
      setIsProcessing(false);
    }
  };

  const retryPaymentConfirmation = () => {
    addLog('\n=== RETRY ATTEMPT ===\n');
    setWebhookTimeline([]);
    setRequestPayload(null);
    setResponseData(null);
    setWebhookStatus('idle');
    setApiCallDuration(0);
    confirmPayment();
  };

  const manualWebhookTest = () => {
    addLog('\n=== MANUAL WEBHOOK TEST TRIGGERED ===\n');
    setWebhookTimeline([]);
    setRequestPayload(null);
    setResponseData(null);
    setWebhookStatus('idle');
    setApiCallDuration(0);
    confirmPayment();
  };

  const copyLogsToClipboard = () => {
    const logsText = debugLogs.join('\n');
    navigator.clipboard.writeText(logsText);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  useEffect(() => {
    if (txRef && status === 'successful') {
      confirmPayment();
    } else {
      addLog('No tx_ref or status is not successful - skipping payment confirmation');
      setConfirmationStatus('success');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-6">
          {confirmationStatus === 'success' && !errorMessage ? (
            <CheckCircle className="text-green-500 mx-auto" size={80} />
          ) : confirmationStatus === 'error' || errorMessage ? (
            <AlertCircle className="text-red-500 mx-auto" size={80} />
          ) : (
            <div className="w-20 h-20 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mt-4">Payment Successful!</h1>
          <p className="text-gray-600 mt-2 text-center max-w-md mx-auto">
            Your payment was processed successfully.
          </p>
        </div>

        {/* Webhook Status Indicator */}
        {(isProcessing || webhookStatus !== 'idle') && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 mb-4 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {webhookStatus === 'sending' && (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {webhookStatus === 'sent' && (
                    <CheckCircle className="text-green-600" size={20} />
                  )}
                  {webhookStatus === 'failed' && (
                    <AlertCircle className="text-red-600" size={20} />
                  )}
                  {webhookStatus === 'idle' && (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <div>
                    <p className="text-sm text-gray-900 font-bold">
                      {webhookStatus === 'sending' && 'Sending Webhook to Backend...'}
                      {webhookStatus === 'sent' && 'Webhook Sent Successfully'}
                      {webhookStatus === 'failed' && 'Webhook Failed'}
                      {webhookStatus === 'idle' && 'Preparing Webhook...'}
                    </p>
                    {apiCallDuration > 0 && (
                      <p className="text-xs text-gray-600 mt-0.5">
                        Response time: {apiCallDuration}ms
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-gray-300">
                    POST /api/flutterwave/manual-trigger
                  </span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              {webhookStatus === 'sending' && (
                <div className="w-full bg-blue-200 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full animate-pulse" style={{width: '70%'}}></div>
                </div>
              )}
              {webhookStatus === 'sent' && (
                <div className="w-full bg-green-200 rounded-full h-1.5">
                  <div className="bg-green-600 h-1.5 rounded-full transition-all duration-500" style={{width: '100%'}}></div>
                </div>
              )}
              {webhookStatus === 'failed' && (
                <div className="w-full bg-red-200 rounded-full h-1.5">
                  <div className="bg-red-600 h-1.5 rounded-full" style={{width: '100%'}}></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-blue-800 font-medium">
                Confirming payment with backend...
              </p>
            </div>
          </div>
        )}

        {/* Polling Status */}
        {isPolling && (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-purple-800 font-medium">
                Checking order status...
              </p>
            </div>
          </div>
        )}

        {/* Success Status with Order Status */}
        {!isProcessing && !isPolling && confirmationStatus === 'success' && orderStatus === 'paid' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div className="flex-1">
                <p className="text-sm font-bold text-green-900">
                  Payment Confirmed Successfully!
                </p>
                <p className="text-sm text-green-800 mt-1">
                  Your order status has been updated to <span className="font-semibold">PAID</span>. The vendor will begin processing your order shortly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Warning if status didn't update */}
        {!isProcessing && !isPolling && confirmationStatus === 'success' && orderStatus && orderStatus !== 'paid' && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-yellow-600" size={24} />
              <div className="flex-1">
                <p className="text-sm font-bold text-yellow-900">
                  Payment Received - Status Update Pending
                </p>
                <p className="text-sm text-yellow-800 mt-1">
                  Payment webhook was triggered, but order status is currently: <span className="font-semibold">{orderStatus}</span>
                  {orderStatus !== 'paid' && ' (Expected: PAID)'}
                </p>
                <p className="text-sm text-yellow-700 mt-2">
                  Please check your order dashboard. If the issue persists, contact support with your transaction reference.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Status */}
        {!isProcessing && confirmationStatus === 'error' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 mt-0.5" size={24} />
              <div className="flex-1">
                <p className="text-sm font-bold text-red-900 mb-2">
                  Payment Confirmation Failed
                </p>
                {errorMessage && (
                  <div className="bg-red-100 rounded p-3 mb-3">
                    <p className="text-sm text-red-800 font-mono">
                      {errorMessage}
                    </p>
                  </div>
                )}
                <p className="text-sm text-red-800">
                  Your payment was successful with the payment provider, but there was an error confirming it with our system.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={retryPaymentConfirmation}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <RefreshCw size={16} />
                    Retry Confirmation
                  </button>
                  <button
                    onClick={() => setShowDebug(!showDebug)}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    {showDebug ? 'Hide' : 'Show'} Debug Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Reference */}
        {txRef && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Transaction Reference:</strong> {txRef}
            </p>
            {transactionId && (
              <p className="text-sm text-blue-700 mb-2">
                <strong>Transaction ID:</strong> {transactionId}
              </p>
            )}
            {orderId && (
              <p className="text-sm text-blue-700 mb-2">
                <strong>Order ID:</strong> #{orderId}
              </p>
            )}
            {orderStatus && (
              <p className="text-sm text-blue-700">
                <strong>Current Status:</strong> <span className="uppercase font-semibold">{orderStatus}</span>
              </p>
            )}
          </div>
        )}

        {/* Webhook Timeline */}
        {webhookTimeline.length > 0 && (showDebug || confirmationStatus === 'error') && (
          <div className="mt-4 p-4 bg-white rounded-lg border-2 border-gray-200 mb-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Webhook Timeline</h3>
            <div className="space-y-2">
              {webhookTimeline.map((item, index) => (
                <div key={index} className="flex items-start gap-3 text-xs">
                  <div className="flex-shrink-0 mt-0.5">
                    {item.status === 'success' && (
                      <CheckCircle className="text-green-600" size={16} />
                    )}
                    {item.status === 'error' && (
                      <AlertCircle className="text-red-600" size={16} />
                    )}
                    {item.status === 'pending' && (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{item.event}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {item.timestamp.toLocaleTimeString()} ({item.timestamp.getMilliseconds()}ms)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Request/Response Display */}
        {(requestPayload || responseData) && (showDebug || confirmationStatus === 'error') && (
          <div className="mt-4 space-y-4 mb-4">
            {requestPayload && (
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">REQUEST</span>
                    Webhook Payload Sent
                  </h3>
                </div>
                <pre className="text-xs bg-gray-900 text-blue-300 p-3 rounded overflow-x-auto font-mono">
                  {JSON.stringify(requestPayload, null, 2)}
                </pre>
              </div>
            )}

            {responseData && (
              <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-green-900 flex items-center gap-2">
                    <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs">RESPONSE</span>
                    Backend Response Received
                  </h3>
                  {apiCallDuration > 0 && (
                    <span className="text-xs text-green-700 font-semibold">
                      {apiCallDuration}ms
                    </span>
                  )}
                </div>
                <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto font-mono">
                  {JSON.stringify(responseData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Backend Response Section */}
        {backendResponse && (showDebug || confirmationStatus === 'error') && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-gray-900">Backend Response</h3>
            </div>
            <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto font-mono">
              {JSON.stringify(backendResponse, null, 2)}
            </pre>
          </div>
        )}

        {/* Developer Info Banner */}
        {showDebug && (
          <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-300 mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="bg-gray-700 text-white px-2 py-0.5 rounded text-xs">DEV INFO</span>
              How to View Webhook in Browser DevTools
            </h3>
            <div className="text-xs text-gray-700 space-y-1">
              <p className="font-semibold">To see the webhook POST request in your browser:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2 mt-2">
                <li>Open Browser DevTools (F12 or Right-click → Inspect)</li>
                <li>Go to the <span className="font-mono bg-gray-200 px-1 rounded">Network</span> tab</li>
                <li>Filter by <span className="font-mono bg-gray-200 px-1 rounded">XHR</span> or <span className="font-mono bg-gray-200 px-1 rounded">Fetch</span></li>
                <li>Look for request to <span className="font-mono bg-blue-100 px-1 rounded text-blue-800">/api/flutterwave/manual-trigger</span></li>
                <li>Click on it to see Request Payload and Response</li>
              </ol>
              <p className="mt-2 text-gray-600 italic">
                Note: The real Flutterwave webhook (server-to-server) won't appear here.
                This manual trigger is sent from your browser as a fallback mechanism.
              </p>
            </div>
          </div>
        )}

        {/* Debug Logs Section */}
        {debugLogs.length > 0 && (showDebug || confirmationStatus === 'error') && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-gray-900">Debug Logs</h3>
              <button
                onClick={copyLogsToClipboard}
                className="px-3 py-1 bg-gray-700 text-white rounded text-xs font-medium flex items-center gap-1 hover:bg-gray-800 transition-colors"
              >
                {copiedToClipboard ? (
                  <>
                    <Check size={12} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy Logs
                  </>
                )}
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto bg-gray-900 text-gray-300 p-3 rounded font-mono text-xs">
              {debugLogs.map((log, index) => (
                <div key={index} className="mb-1 hover:bg-gray-800 px-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Webhook Testing & Debug Controls */}
        <div className="mt-4 flex flex-wrap gap-3 justify-center items-center">
          {/* Manual Webhook Test Button */}
          {txRef && (
            <button
              onClick={manualWebhookTest}
              disabled={isProcessing || isPolling}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
            >
              <RefreshCw size={16} />
              Test Webhook Again
            </button>
          )}

          {/* Toggle Debug Button */}
          {debugLogs.length > 0 && (
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              {showDebug ? 'Hide' : 'Show'} Technical Details
            </button>
          )}

          {/* Real-time Network Monitor Indicator */}
          {webhookStatus !== 'idle' && (
            <div className="px-3 py-2 bg-gray-100 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                webhookStatus === 'sending' ? 'bg-blue-500 animate-pulse' :
                webhookStatus === 'sent' ? 'bg-green-500' :
                webhookStatus === 'failed' ? 'bg-red-500' : 'bg-gray-400'
              }`}></div>
              Network Monitor Active
            </div>
          )}
        </div>
      
        {/* Navigation Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          {orderType === 'ecommerce_order' ? (
            <>
              <Link
                to="/dashboard/user/orders"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium"
              >
                View My Orders
              </Link>
              <Link
                to="/ecommerce"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center font-medium"
              >
                Continue Shopping
              </Link>
            </>
          ) : orderType === 'apartment_booking' ? (
            <>
              <Link
                to="/dashboard/user/bookings"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium"
              >
                View My Bookings
              </Link>
              <Link
                to="/service-apartments"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center font-medium"
              >
                Browse More Properties
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard/user/my-service-orders"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium"
              >
                View My Service Orders
              </Link>
              <Link
                to="/general-services"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center font-medium"
              >
                Browse More Services
              </Link>
            </>
          )}
          <Link
            to="/dashboard/user"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess