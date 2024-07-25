import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, data, type }) => {
  const modalRef = useRef();

  useEffect(() => {
    // Event listener to close modal on click outside
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-11/12 sm:w-96"
      >
        <button
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {type}
        </h2>
        <ul className="space-y-2">
          {data.map((item, index) => (
            <li key={index}>
              <a
                href={`https://github.com/${item}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
