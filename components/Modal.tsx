// Modal.tsx
import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ onClose, title, children }) => {
  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">{title}</h4>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
