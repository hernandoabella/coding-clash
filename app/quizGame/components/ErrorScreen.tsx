// components/ErrorScreen.tsx (Alternative Version)
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaRedo, FaHome, FaQuestionCircle } from "react-icons/fa";

interface ErrorScreenProps {
  error: string;
  errorCode?: string;
  onRetry: () => void;
  onHome?: () => void;
}

export default function ErrorScreen({ error, errorCode, onRetry, onHome }: ErrorScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 text-center border border-red-100"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FaExclamationTriangle className="w-10 h-10 text-red-600" />
        </motion.div>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something Went Wrong</h2>
        
        {/* Error Message */}
        <p className="text-gray-600 mb-4">{error}</p>
        
        {/* Error Code (if provided) */}
        {errorCode && (
          <p className="text-sm text-gray-500 mb-6">
            Error code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{errorCode}</span>
          </p>
        )}

        {/* Troubleshooting Tips */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <FaQuestionCircle className="w-4 h-4" />
            <span className="font-semibold">Troubleshooting Tips</span>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Check your internet connection</li>
            <li>• Refresh the page and try again</li>
            <li>• Make sure you have the latest browser version</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex-1"
          >
            <FaRedo className="w-4 h-4" />
            Try Again
          </motion.button>
          
          {onHome && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHome}
              className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex-1"
            >
              <FaHome className="w-4 h-4" />
              Go Home
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}