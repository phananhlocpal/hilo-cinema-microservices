export const PaymentConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 relative z-10">
                <h2 className="text-xl font-semibold mb-4">Xác nhận thanh toán</h2>
                <p className="mb-4">Bạn có chắc chắn muốn thanh toán không?</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="mr-2 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary-700"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};
