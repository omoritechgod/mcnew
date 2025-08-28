import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { serviceOrderApi } from "../services/serviceOrderApi";

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const txRef = searchParams.get('tx_ref');
  const status = searchParams.get('status');
  const transactionId = searchParams.get('transaction_id');
  
  useEffect(() => {
    // Manual payment confirmation as fallback
    if (txRef && status === 'successful') {
      const confirmPayment = async () => {
        setIsProcessing(true);
        try {
          // Extract service order ID from tx_ref (assuming format like "flw_101" or "service_order_101")
          let serviceOrderId: number | null = null;
          
          // Extract service order ID from tx_ref
          // Format could be: "service_order_101", "flw_101", or just "101"
          if (txRef.includes('service_order_')) {
            const match = txRef.match(/service_order_(\d+)/);
            if (match) serviceOrderId = parseInt(match[1]);
          } else if (txRef.includes('flw_')) {
            const match = txRef.match(/flw_(\d+)/);
            if (match) serviceOrderId = parseInt(match[1]);
          } else {
            // Try to extract any number from tx_ref
            const match = txRef.match(/(\d+)/);
            if (match) serviceOrderId = parseInt(match[1]);
          }
          
          if (serviceOrderId) {
            await serviceOrderApi.manualPaymentTrigger({
              data: {
                status: 'successful',
                tx_ref: txRef,
                meta: {
                  type: 'service_order',
                  service_order_id: serviceOrderId
                }
              }
            });
            
            console.log('Manual payment trigger successful for service order:', serviceOrderId);
            setConfirmationStatus('success');
          } else {
            console.error('Could not extract service order ID from tx_ref:', txRef);
            setConfirmationStatus('error');
          }
        } catch (error) {
          console.error('Error confirming payment:', error);
          setConfirmationStatus('error');
        } finally {
          setIsProcessing(false);
        }
      };
      
      confirmPayment();
    } else {
      setConfirmationStatus('success'); // Default to success if no manual trigger needed
    }
  }, [txRef, status]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <CheckCircle className="text-green-500" size={80} />
      <h1 className="text-3xl font-bold text-gray-900 mt-4">Payment Successful!</h1>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        Your payment was processed successfully. 
        {isProcessing ? ' We are confirming your payment...' : ' You can now track your service order in your dashboard.'}
      </p>
      
      {/* Processing Status */}
      {isProcessing && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-blue-800">Confirming payment status...</p>
          </div>
        </div>
      )}

      {/* Confirmation Status */}
      {!isProcessing && confirmationStatus === 'error' && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Payment was successful, but there may be a delay in updating your order status. 
            Please check your dashboard in a few minutes.
          </p>
        </div>
      )}

      {txRef && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Transaction Reference:</strong> {txRef}
          </p>
          {transactionId && (
            <p className="text-sm text-blue-700 mt-1">
              <strong>Transaction ID:</strong> {transactionId}
            </p>
          )}
          <p className="text-sm text-blue-700 mt-1">
            {confirmationStatus === 'success' 
              ? 'Your order status has been updated automatically.'
              : 'Your order status will be updated shortly.'}
          </p>
        </div>
      )}
      
      <div className="mt-6 flex gap-4">
        <Link
          to="/dashboard/user/my-service-orders"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          View My Service Orders
        </Link>
        <Link
          to="/dashboard/user/bookings"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          View My Bookings
        </Link>
        <Link
          to="/general-services"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Browse More Services
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess