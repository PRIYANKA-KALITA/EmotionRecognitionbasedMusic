

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Crown } from 'lucide-react';
// import PaymentForm from './PaymentForm'; // 🆕 Import PaymentForm

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: [
      'Basic music recommendations',
      'Ad-supported listening',
      'Standard audio quality',
      'Mobile app access'
    ]
  },
  {
    name: 'Premium',
    price: '$9.99',
    features: [
      'Advanced recommendations',
      'Ad-free listening',
      'High-quality audio',
      'Offline mode',
      'Unlimited skips'
    ],
    popular: true
  },
  {
    name: 'Family',
    price: '$14.99',
    features: [
      'Up to 6 accounts',
      'All Premium features',
      'Family mix playlist',
      'Parental controls',
      'Separate profiles'
    ]
  }
];

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null); // 🆕 Track selected plan

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#252525] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <Crown className="w-8 h-8 text-orange-500" />
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Choose Your Plan
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.name}
                    whileHover={{ scale: 1.02 }}
                    className={`relative rounded-xl p-6 ${
                      plan.popular
                        ? 'bg-orange-500/10 border-2 border-orange-500'
                        : 'bg-[#303030] border-2 border-transparent'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 transform -translate-x-1/2
                                     bg-orange-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}

                    <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                    <p className="text-3xl font-bold text-white mb-6">{plan.price}</p>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center text-gray-300">
                          <Check className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => setSelectedPlan(plan.name)} // 🆕 Set selected plan
                      className={`w-full py-3 rounded-lg font-medium transition-colors duration-300 ${
                        plan.popular
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      Choose Plan
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* 🆕 Show PaymentForm when a plan is selected */}
              {/* {selectedPlan && (
                <PaymentForm
                  userId="test-user-123"
                  plan={selectedPlan}
                  price={plans.find((p) => p.name === selectedPlan)?.price || ''}
                  onPaymentSuccess={onClose} // Close modal on success
                />
              )} */}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;