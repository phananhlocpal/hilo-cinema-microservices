import React, { useState, useEffect } from "react";

const ModalAlert = ({ message, type = "success", isVisible, onClose }) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [isVisible]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50"></div>
      <div className={`bg-white rounded-lg p-6 shadow-lg z-50 max-w-lg mx-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-medium ${
            type === "success" ? "text-green-600" : "text-red-600"
          }`}>
            {type === "success" ? "Success" : "Error"}
          </h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            &times;
          </button>
        </div>
        <div className="text-sm text-gray-700">
          {message}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAlert;
