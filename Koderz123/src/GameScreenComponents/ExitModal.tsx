import React from "react";
import "./ExitModal.css";

interface ExitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ExitModal: React.FC<ExitModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">Are you sure you want to exit?</h2>
                <div className="modal-buttons">
                    <button className="modal-button yes-button" onClick={onConfirm}>
                        Yes
                    </button>
                    <button className="modal-button no-button" onClick={onClose}>
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExitModal;
