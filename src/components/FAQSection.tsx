import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQSection: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does McDee's escrow system protect my payments?",
      answer: "Our escrow system holds your payment securely until the service is completed to your satisfaction. The vendor only receives payment after you confirm that the service has been delivered as expected. If there are any issues, our dispute resolution team will investigate and ensure a fair outcome."
    },
    {
      question: "What verification process do vendors go through?",
      answer: "All vendors must undergo thorough verification including identity verification through NIN (for individuals) or CAC registration (for businesses), background checks, and business document reviews. Only verified vendors can post visible listings and receive bookings on our platform."
    },
    {
      question: "How does the seal-checking system work for food delivery?",
      answer: "Our delivery partners verify that all food packages are properly sealed before pickup and document the condition with photos. The seals are checked again upon delivery to ensure food safety and prevent tampering during transit."
    },
    {
      question: "What happens if I'm not satisfied with a service?",
      answer: "If you're not satisfied, you can report the issue through our platform. Our customer support team will investigate and work to resolve the matter. Depending on the situation, you may receive a partial or full refund, or the vendor may be required to redo the service."
    },
    {
      question: "How do I track my ride or delivery in real-time?",
      answer: "Once your ride or delivery is confirmed, you'll receive a tracking link that shows the real-time location of your rider or delivery person. You'll also receive SMS and push notifications with status updates throughout the process."
    },
    {
      question: "What are the fees for using McDee's services?",
      answer: "McDee charges a small platform fee on completed transactions to maintain our security systems and customer support. The exact fee varies by service type and is always displayed clearly before you confirm any booking or purchase."
    },
    {
      question: "How quickly can I get a ride or food delivery?",
      answer: "Ride requests are typically matched with nearby riders within 2-5 minutes. Food delivery times depend on restaurant preparation time and distance, but most deliveries are completed within 30-45 minutes of order confirmation."
    },
    {
      question: "Can I cancel a booking or order after it's confirmed?",
      answer: "Yes, you can cancel most bookings within a certain timeframe. However, cancellation policies vary by service type. Some services may charge a small cancellation fee if canceled after the vendor has already started preparing or traveling."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 rounded-full p-4">
              <HelpCircle size={40} className="text-blue-600" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Find answers to common questions about McDee's services and platform
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openFAQ === index ? (
                    <ChevronUp size={24} className="text-blue-600" />
                  ) : (
                    <ChevronDown size={24} className="text-gray-400" />
                  )}
                </div>
              </button>
              
              {openFAQ === index && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-blue-100 mb-6">
              Our support team is here to help you 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                Contact Support
              </button>
              <button className="border-2 border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-white hover:text-blue-600 transition-colors">
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
