import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const Modal = ({ isOpen, onClose, data, type, user }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-[500px] max-h-[80vh] overflow-auto relative"
      >
        <button
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {type} Information
        </h2>
        {user && (
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={user.avatar_url}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{user.login}</h3>
                <p className="text-gray-600 dark:text-gray-400">{user.bio}</p>
              </div>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <p>Followers: {user.followers}</p>
              <p>Following: {user.following}</p>
              <p>Repos: {user.public_repos}</p>
            </div>
          </div>
        )}
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
