import React from 'react';
import { FiAlertCircle, FiX, FiCheckCircle, FiXCircle } from 'react-icons/fi';

import { Container, Toast } from './styles';

const ToastContainer: React.FC = () => {
  return (
    <Container>
      <Toast hasDescription>
        <FiAlertCircle size={20} />

        <div>
          <strong>Aconteceu um erro</strong>
          <p>Não foi possível fazer login na aplicação</p>
        </div>

        <button type="button">
          <FiX size={18} />
        </button>
      </Toast>

      <Toast type="error" hasDescription>
        <FiXCircle size={20} />

        <div>
          <strong>Aconteceu um erro</strong>
          <p>Não foi possível fazer login na aplicação</p>
        </div>

        <button type="button">
          <FiX size={18} />
        </button>
      </Toast>

      <Toast type="success" hasDescription={false}>
        <FiCheckCircle size={20} />

        <div>
          <strong>Processado com sucesso</strong>
        </div>

        <button type="button">
          <FiX size={18} />
        </button>
      </Toast>
    </Container>
  );
};

export default ToastContainer;
