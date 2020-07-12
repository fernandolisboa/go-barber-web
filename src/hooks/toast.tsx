import React, { createContext, useCallback, useContext, useState } from 'react';
import { uuid } from 'uuidv4';

import ToastContainer from '../components/ToastContainer';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'info' | 'error' | 'success';
}

interface ToastContextData {
  addToast(toast: Omit<ToastMessage, 'id'>): void;
  removeToast(toast: Pick<ToastMessage, 'id'>): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const message = {
      id: uuid(),
      ...toast,
    };
    setMessages(state => [...state, message]);
  }, []);

  const removeToast = useCallback(({ id }: Pick<ToastMessage, 'id'>) => {
    setMessages(state => state.filter(message => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

export { ToastProvider, useToast };
