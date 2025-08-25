import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentSuccess: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <CheckCircle className="text-green-500" size={80} />
      <h1 className="text-3xl font-bold text-gray-900 mt-4">Payment Successful!</h1>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        Your payment was processed successfully. You can now check in when your booking starts.
      </p>
      <Link
        to="/dashboard/user/bookings"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go to My Bookings
      </Link>
    </div>
  );
};

export default PaymentSuccess;
