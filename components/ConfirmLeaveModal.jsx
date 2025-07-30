import React from 'react';
import './ConfirmLeaveModal.css'; // optional for styling

const ConfirmLeaveModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>⚠️ Leave Quiz?</h2>
        <p>Are you sure you want to leave the quiz? Your progress may be lost.</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-btn">Yes, Leave</button>
          <button onClick={onCancel} className="cancel-btn">Stay</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLeaveModal;