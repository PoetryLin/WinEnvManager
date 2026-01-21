import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const icon = type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />;

    return (
        <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 z-50 animate-fade-in-up`}>
            {icon}
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="hover:text-gray-200 transition-colors">
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
