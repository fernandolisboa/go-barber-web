import React, { useEffect } from 'react';
import { FiX, FiInfo, FiXCircle, FiCheckCircle } from 'react-icons/fi';

import { ToastMessage, useToast } from '../../../hooks/toast';

import { Container } from './styles';

const icons = {
  info: <FiInfo size={20} />,
  error: <FiXCircle size={20} />,
  success: <FiCheckCircle size={20} />,
};

interface ToastProps {
  toast: ToastMessage;
  style: object;
}

const Toast: React.FC<ToastProps> = ({ toast, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast), 3000);
    return () => clearTimeout(timer);
  }, [removeToast, toast]);

  return (
    <Container
      type={toast.type}
      hasdescription={Number(!!toast.description)}
      style={style}
    >
      {icons[toast.type || 'info']}

      <div>
        <strong>{toast.title}</strong>
        {toast.description && <p>{toast.description}</p>}
      </div>

      <button type="button" onClick={() => removeToast(toast)}>
        <FiX size={18} />
      </button>
    </Container>
  );
};

export default Toast;
