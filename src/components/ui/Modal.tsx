import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div className="p-4 relative">
                    <button onClick={onClose} className="absolute top-4 right-2 border-2 text-2xl text-white  bg-red-500 hover:text-white  rounded-full
                    w-8 h-8 flex items-center justify-center float-right">
                        &times;
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
