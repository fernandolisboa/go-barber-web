import React from 'react';

import Toast from './Toast';

import { ToastMessage } from '../../hooks/toast';
import { Container } from './styles';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => (
  <Container>
    {messages.map(toast => (
      <Toast key={toast.id} toast={toast} />
    ))}
  </Container>
);

export default ToastContainer;
