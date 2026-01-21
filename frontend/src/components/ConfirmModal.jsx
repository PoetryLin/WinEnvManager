import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
    const { t } = useLanguage();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    {t('appTitle')}
                </h3>

                <p className="text-gray-700 dark:text-gray-300 mb-8">
                    {message}
                </p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        {t('confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
