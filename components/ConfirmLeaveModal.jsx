import React from 'react';
import './WarningModal.css'; 

const ConfirmLeaveModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>⚠️ Leave Quiz?</h2>
        <p>This will delete your current quiz progress.<br/> Are you sure you want to leave?</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-btn">Yes, Leave</button>
          <button onClick={onCancel} className="cancel-btn">Stay</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLeaveModal;