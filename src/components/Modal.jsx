import React from "react";
import { MdClose } from "react-icons/md";

const Modal = ({ isOpen, onClose, data, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#12192A] p-8 rounded-lg w-[90%] md:w-[60%] lg:w-[40%] relative">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-500 dark:text-gray-300"
          onClick={onClose}
        >
          <MdClose />
        </button>
        <h2 className="text-xl font-bold mb-4">{type}</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 border-b border-gray-300 dark:border-gray-600"
            >
              {type === "Repos" ? (
                <img
                  src={`https://avatars.githubusercontent.com/${item}`}
                  alt={item}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{item}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
