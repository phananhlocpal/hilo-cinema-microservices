import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSeat, deselectSeat } from "../../../../reduxHilo/actions/bookingAction";
import { useColorModeValue, Button, ModalFooter } from "@chakra-ui/react";
import { saveSeats } from "../../../../reduxHilo/actions/seatAction";
import ModalAlert from "components/alert/modalAlert"; // Import ModalAlert

export default function AddSeatForm({ roomId, rowNum, colNum, onClose }) {
    const dispatch = useDispatch();
    const selectedSeats = useSelector((state) => state.booking.selectedSeats);
    const [vipSeats, setVipSeats] = useState([]); // State để lưu các ghế VIP
    const [coupleSeats, setcoupleSeats] = useState([]); // State để lưu các ghế đôi
    const [inactiveSeats, setInactiveSeats] = useState([]); // State để lưu các ghế inactive
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const textColor = useColorModeValue("black", "white");
    const seatTextColor = useColorModeValue("black", "white");

    // Hàm xử lý khi nhấp vào ghế
    const handleSeatClick = (seatName) => {
        if (isSelected(seatName)) {
            dispatch(deselectSeat(seatName));
        } else {
            dispatch(selectSeat(seatName));
        }
    };

    // Kiểm tra xem ghế có đang được chọn không
    const isSelected = (seatName) => selectedSeats.includes(seatName);

    // Hàm xử lý khi nhấn nút "Save"
    const handleSave = () => {
        const seatsData = [];

        // Lặp qua hàng và cột để tạo dữ liệu ghế
        for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
            const rowLabel = String.fromCharCode(65 + rowIndex); // Tạo nhãn hàng ghế (A, B, C...)
            for (let colIndex = 0; colIndex < colNum; colIndex++) {
                const seatName = `${rowLabel}${colIndex + 1}`; // Tạo tên ghế (A1, A2,...)
                const seatType = coupleSeats.includes(seatName)
                    ? "couple"
                    : vipSeats.includes(seatName)
                        ? "vip"
                        : "standard"; // Nếu ghế trong danh sách couple thì lưu với loại "couple", nếu là VIP thì "vip", còn lại là "standard"

                const seatStatus = inactiveSeats.includes(seatName)
                    ? "Inactive"
                    : "Active"; // Nếu ghế trong danh sách inactive thì lưu với trạng thái inactive

                // Tạo dữ liệu ghế
                const seatData = {
                    roomId: roomId,
                    colSeat: colIndex + 1,
                    rowSeat: rowIndex + 1,
                    name: seatName,
                    type: seatType,  // Gán loại ghế
                    status: seatStatus,  // Gán trạng thái ghế
                };

                seatsData.push(seatData);
            }
        }

        // Gọi action saveSeats để lưu thông tin ghế
        dispatch(saveSeats(seatsData))
            .then(response => {
                setAlertMessage("Seats added successfully!");
                setAlertType("success");
                setIsAlertVisible(true); // Hiển thị thông báo thành công
            })
            .catch(error => {
                setAlertMessage("Error adding seats! " + error.message);
                setAlertType("error");
                setIsAlertVisible(true); // Hiển thị thông báo lỗi
            });
    };

    // Hàm xử lý khi nhấn vào nút chọn ghế VIP
    const handleVipSelect = () => {
        const newVipSeats = selectedSeats.filter(seat => !vipSeats.includes(seat) && !coupleSeats.includes(seat)); // Chỉ chọn ghế VIP nếu chưa là ghế đôi
        setVipSeats([...vipSeats, ...newVipSeats]); // Cập nhật danh sách ghế VIP
    };

    // Hàm xử lý khi nhấn vào nút chọn ghế đôi
    const handlecoupleSelect = () => {
        if (selectedSeats.length < 2) {
            setAlertMessage("Please select at least two seats for couple seats.");
            setAlertType("error");
            setIsAlertVisible(true); // Hiển thị thông báo lỗi
        } else {
            const newcoupleSeats = selectedSeats.filter(seat => !coupleSeats.includes(seat) && !vipSeats.includes(seat)); // Chỉ chọn ghế đôi nếu chưa là ghế VIP
            setcoupleSeats([...coupleSeats, ...newcoupleSeats]); // Cập nhật danh sách ghế đôi
        }
    };

    // Hàm xử lý khi nhấn vào nút "Seat Hidden"
    const handleHiddenSelect = () => {
        const newInactiveSeats = selectedSeats.filter(seat => !inactiveSeats.includes(seat)); // Chỉ chọn ghế inactive nếu chưa có trong danh sách
        setInactiveSeats([...inactiveSeats, ...newInactiveSeats]); // Cập nhật danh sách ghế inactive
    };

    // Hàm đóng ModalAlert
    const closeAlert = () => {
        setIsAlertVisible(false);
        onClose(); // Đóng form sau khi đóng ModalAlert
    };

    return (
        <>
            <p className="text-s text-center" style={{ color: textColor }}>Màn hình</p>
            <div className="border-2 border-orange-500 mt-3"></div>
            <div className="md:px-6 py-4 px-2 rounded md:mb-8 w-full" style={{ backgroundColor: boxBg }}>
                <div className="md:block flex flex-wrap justify-center w-full h-full overflow-auto">
                    <ul className="seat__layout-rows md:mb-8 w-auto grid grid-cols-1 items-center flex-auto text-o">
                        {[...Array(rowNum)].reverse().map((_, rowIndex) => {
                            const rowLabel = String.fromCharCode(65 + rowIndex); // Tạo nhãn hàng ghế A, B, C...
                            return (
                                <li
                                    key={rowIndex}
                                    className="flex justify-between mb-3 md:gap-0 gap-1 flex-nowrap"
                                >
                                    <div className="text-sm font-semibold flex-none w-5 text-left" style={{ color: textColor }}>
                                        {rowLabel}
                                    </div>
                                    <div className="flex md:gap-2 gap-1 grow justify-center min-w-[398px] flex-1">
                                        {[...Array(colNum)].map((_, colIndex) => {
                                            const seatName = `${rowLabel}${colIndex + 1}`; // Tạo tên ghế (A1, A2,...)
                                            const isDisavailable = false; // Giả định rằng không có ghế nào không khả dụng
                                            const isInvisible = false; // Giả định rằng không có ghế nào vô hình
                                            const isInactive = inactiveSeats.includes(seatName); // Kiểm tra nếu ghế có trong danh sách inactive

                                            return (
                                                <button
                                                    key={colIndex}
                                                    className={`md:h-8 h-6 border rounded md:text-s text-[10px] transition duration-300 ease-in-out ${isInvisible
                                                            ? "invisible"
                                                            : isDisavailable
                                                                ? "bg-gray-300 border-gray-300"
                                                                : isInactive
                                                                    ? "bg-gray-500 border-gray-500" // Màu xám cho ghế inactive
                                                                    : coupleSeats.includes(seatName)
                                                                        ? "text-white bg-blue-500 border-blue-500" // Màu xanh dương cho ghế đôi
                                                                        : vipSeats.includes(seatName)
                                                                            ? "text-white bg-red-500 border-red-500" // Màu đỏ cho ghế VIP
                                                                            : isSelected(seatName)
                                                                                ? "text-white bg-green-500 border-green-500" // Màu xanh lá cây cho ghế chọn
                                                                                : "border-gray-400 hover:bg-green-100 hover:border-green-500"
                                                        } md:w-8 w-6 shadow-sm`}
                                                    disabled={isDisavailable || isInactive} // Ghế inactive sẽ bị disabled
                                                    onClick={() => handleSeatClick(seatName)}
                                                >
                                                    {!isInvisible && (
                                                        <span
                                                            className={`inline-block md:w-8 w-6 text-center`}
                                                            style={{ color: isSelected(seatName) || coupleSeats.includes(seatName) || vipSeats.includes(seatName) ? "white" : seatTextColor }}
                                                        >
                                                            {seatName}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="text-sm font-semibold flex-none w-5 text-right" style={{ color: textColor }}>
                                        {rowLabel}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="flex justify-end gap-5">
                    <Button
                        variant="outline"
                        colorScheme="gray"
                        size="sm"
                        onClick={handleHiddenSelect} // Chọn ghế Hidden
                        leftIcon={
                            <span className="w-5 h-5 bg-gray-500 inline-block rounded-full"></span>
                        }
                    >
                        Seat Hide
                    </Button>
                    <Button
                        variant="outline"
                        colorScheme="red"
                        size="sm"
                        onClick={handleVipSelect} // Chọn ghế VIP
                        leftIcon={<span className="w-5 h-5 bg-red-500 inline-block rounded-full"></span>}
                    >
                        Seat VIP
                    </Button>
                    <Button
                        variant="outline"
                        colorScheme="blue"
                        size="sm"
                        onClick={handlecoupleSelect} // Chọn ghế đôi
                        leftIcon={<span className="w-5 h-5 bg-blue-500 inline-block rounded-full"></span>}
                    >
                        Seat couple
                    </Button>
                </div>
            </div>

            <ModalFooter>
                <Button colorScheme="blue" onClick={handleSave}>Save</Button>
                <Button onClick={onClose} marginLeft={2}>Close</Button>
            </ModalFooter>

            {/* ModalAlert để hiển thị thông báo thành công hoặc lỗi */}
            <ModalAlert
                message={alertMessage}
                type={alertType}
                isVisible={isAlertVisible}
                onClose={closeAlert}
            />
        </>
    );
}
