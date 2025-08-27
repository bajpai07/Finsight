import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion';
import { CopyIcon, CheckCircleIcon } from './icons';

const DUMMY_WALLET_ADDRESS = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';

function PaymentModal({ isOpen, onClose, onConfirm }) {
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(DUMMY_WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    if (amount && !isNaN(amount)) {
      onConfirm(parseFloat(amount));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-slate-900/80 border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Add Funds to Your Account</h2>
            <p className="text-slate-400 mb-6">
              Scan the QR code with your wallet app or copy the address below to deposit funds.
            </p>

            <div className="bg-slate-800 p-6 rounded-xl flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg">
                <QRCode value={DUMMY_WALLET_ADDRESS} size={192} />
              </div>
              <div className="mt-4 text-center">
                <p className="text-slate-300 text-sm">Wallet Address:</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-emerald-400 font-mono text-xs break-all">
                    {DUMMY_WALLET_ADDRESS}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 transition"
                  >
                    {copied ? <CheckCircleIcon /> : <CopyIcon />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-slate-300 mb-2">Amount (USD)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 500"
                className="w-full rounded-lg bg-slate-800/80 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!amount || isNaN(amount)}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                Confirm Payment
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PaymentModal;
