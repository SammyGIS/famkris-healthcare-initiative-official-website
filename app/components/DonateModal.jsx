"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check } from "lucide-react";

export default function DonateModal({ isOpen, onClose }) {
    const [copiedField, setCopiedField] = useState(null);

    const accountDetails = {
        bankName: "Example Bank of Nigeria",
        accountName: "Famkris Healthcare Initiative",
        accountNumber: "0123456789",
        accountType: "NGN Current Account",
        swiftCode: "EXAMPLEXXXX",
        additionalInfo: "Please include your name or organization in the reference/narration field."
    };

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </motion.div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                Support Our Mission
                            </h2>
                            <p className="text-gray-600">
                                Your donation helps us continue making a difference
                            </p>
                        </div>

                        {/* Account Details */}
                        <div className="space-y-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold text-gray-700">
                                        Bank Name
                                    </span>
                                    <button
                                        onClick={() =>
                                            copyToClipboard(accountDetails.bankName, "bankName")
                                        }
                                        className="text-green-600 hover:text-green-700 transition-colors"
                                    >
                                        {copiedField === "bankName" ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-gray-900 font-medium">
                                    {accountDetails.bankName}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold text-gray-700">
                                        Account Name
                                    </span>
                                    <button
                                        onClick={() =>
                                            copyToClipboard(accountDetails.accountName, "accountName")
                                        }
                                        className="text-green-600 hover:text-green-700 transition-colors"
                                    >
                                        {copiedField === "accountName" ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-gray-900 font-medium">
                                    {accountDetails.accountName}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold text-gray-700">
                                        Account Number
                                    </span>
                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                accountDetails.accountNumber,
                                                "accountNumber"
                                            )
                                        }
                                        className="text-green-600 hover:text-green-700 transition-colors"
                                    >
                                        {copiedField === "accountNumber" ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-gray-900 font-medium text-xl">
                                    {accountDetails.accountNumber}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold text-gray-700">
                                        Account Type
                                    </span>
                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                accountDetails.accountType,
                                                "accountType"
                                            )
                                        }
                                        className="text-green-600 hover:text-green-700 transition-colors"
                                    >
                                        {copiedField === "accountType" ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-gray-900 font-medium">
                                    {accountDetails.accountType}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold text-gray-700">
                                        SWIFT Code (International)
                                    </span>
                                    <button
                                        onClick={() =>
                                            copyToClipboard(accountDetails.swiftCode, "swiftCode")
                                        }
                                        className="text-green-600 hover:text-green-700 transition-colors"
                                    >
                                        {copiedField === "swiftCode" ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-gray-900 font-medium">
                                    {accountDetails.swiftCode}
                                </p>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-green-800">
                                <span className="font-semibold">Note:</span>{" "}
                                {accountDetails.additionalInfo}
                            </p>
                        </div>

                        {/* Action Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                            Close
                        </motion.button>

                        {/* Thank You Message */}
                        <p className="text-center text-sm text-gray-600 mt-4">
                            Thank you for your generous support! 💚
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
