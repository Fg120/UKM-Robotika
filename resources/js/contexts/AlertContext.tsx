import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertMessage {
    id: string;
    type: AlertType;
    title?: string;
    message: string;
    duration?: number;
}

interface AlertContextType {
    showAlert: (type: AlertType, message: string, title?: string, duration?: number) => void;
    success: (message: string, title?: string, duration?: number) => void;
    error: (message: string, title?: string, duration?: number) => void;
    warning: (message: string, title?: string, duration?: number) => void;
    info: (message: string, title?: string, duration?: number) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

interface AlertProviderProps {
    children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    const [alerts, setAlerts] = useState<AlertMessage[]>([]);

    const removeAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const showAlert = (type: AlertType, message: string, title?: string, duration: number = 5000) => {
        const id = Math.random().toString(36).substr(2, 9);
        const alert: AlertMessage = { id, type, message, title, duration };
        
        setAlerts(prev => [...prev, alert]);

        if (duration > 0) {
            setTimeout(() => removeAlert(id), duration);
        }
    };

    const success = (message: string, title?: string, duration?: number) => {
        showAlert('success', message, title, duration);
    };

    const error = (message: string, title?: string, duration?: number) => {
        showAlert('error', message, title, duration);
    };

    const warning = (message: string, title?: string, duration?: number) => {
        showAlert('warning', message, title, duration);
    };

    const info = (message: string, title?: string, duration?: number) => {
        showAlert('info', message, title, duration);
    };

    const getAlertIcon = (type: AlertType) => {
        switch (type) {
            case 'success': return <CheckCircle className="h-4 w-4" />;
            case 'error': return <XCircle className="h-4 w-4" />;
            case 'warning': return <AlertCircle className="h-4 w-4" />;
            case 'info': return <Info className="h-4 w-4" />;
        }
    };

    const getAlertClassName = (type: AlertType) => {
        switch (type) {
            case 'success': return 'border-green-200 bg-green-50 text-green-800';
            case 'error': return 'border-red-200 bg-red-50 text-red-800';
            case 'warning': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
            case 'info': return 'border-blue-200 bg-blue-50 text-blue-800';
        }
    };

    return (
        <AlertContext.Provider value={{ showAlert, success, error, warning, info }}>
            {children}
            
            {/* Alert Container */}
            <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
                {alerts.map((alert) => (
                    <Alert 
                        key={alert.id} 
                        className={`${getAlertClassName(alert.type)} shadow-lg transition-all duration-300 ease-in-out animate-in slide-in-from-right-full`}
                    >
                        {getAlertIcon(alert.type)}
                        {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
                        <AlertDescription>{alert.message}</AlertDescription>
                        <button
                            onClick={() => removeAlert(alert.id)}
                            className="absolute top-2 right-2 text-current opacity-70 hover:opacity-100"
                        >
                            <XCircle className="h-4 w-4" />
                        </button>
                    </Alert>
                ))}
            </div>
        </AlertContext.Provider>
    );
};