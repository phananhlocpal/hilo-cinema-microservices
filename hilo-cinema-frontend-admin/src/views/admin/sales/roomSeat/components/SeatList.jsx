import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSeat,
  deselectSeat,
} from "../../../../../reduxHilo/actions/bookingAction";
import { fetchSeatsByRoom } from "../../../../../reduxHilo/actions/seatAction";
import { useColorModeValue } from "@chakra-ui/system";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import AddSeatForm from "./AddSeatForm";
import EditSeatForm from "./EditSeatForm"; // Import EditSeatForm

export default function SeatList({ roomId, rowNum, colNum }) {
  const dispatch = useDispatch();
  const { seats, loading, error } = useSelector((state) => state.seat);
  const selectedSeats = useSelector((state) => state.booking.selectedSeats);
  const {
    isOpen: isSeatModalOpen,
    onOpen: onSeatModalOpen,
    onClose: onSeatModalClose,
  } = useDisclosure();

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const [selectedSeatId, setSelectedSeatId] = useState(null); // State to store selected seat ID

  useEffect(() => {
    if (roomId) {
      dispatch(fetchSeatsByRoom(roomId));
    }
  }, [dispatch, roomId]);

  useEffect(() => {
    if (selectedSeatId) {
      dispatch(fetchSeatsByRoom(roomId)); // Cập nhật danh sách ghế sau khi chọn ghế
    }
  }, [selectedSeatId, dispatch, roomId]);

  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("black", "white");
  const seatTextColor = useColorModeValue("black", "white");

  const handleSeatClick = (seat) => {
    console.log(`Seat selected: ${seat.id}`);
    if (isSelected(seat)) {
      dispatch(deselectSeat(seat.id)); // Bỏ chọn ghế khi đã được chọn
    } else {
      dispatch(selectSeat(seat.id)); // Chọn ghế nếu chưa được chọn
    }
    setSelectedSeatId(seat.id); // Save selected seat ID
  };

  const handleEditSeat = () => {
    if (selectedSeatId) {
      onEditModalOpen(); // Open Edit Modal
    } else {
      alert("Please select a seat to edit.");
    }
  };

  const handleSave = () => {
    dispatch(fetchSeatsByRoom(roomId)); // Cập nhật lại danh sách ghế sau khi lưu
    onEditModalClose(); // Đóng modal sau khi cập nhật
  };

  // Kiểm tra xem ghế có đang được chọn không
  const isSelected = (seat) => {
    return selectedSeats.some((seatId) => seatId === seat.id);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <div className="flex justify-end mt-5">
          <Button
            bg="transparent"
            color="blue.500"
            border="1px solid"
            borderColor="blue.500"
            _hover={{ bg: "blue.500", color: "white" }}
            _active={{ bg: "blue.600", color: "white" }}
            borderRadius="md"
            boxShadow="md"
            px={6}
            py={3}
            w="full"
            onClick={onSeatModalOpen} // Mở modal khi nhấn vào nút Add Room
          >
            Add Seat
          </Button>
        </div>
        <Modal isOpen={isSeatModalOpen} onClose={onSeatModalClose} size="xl">
          <ModalOverlay />
          <ModalContent maxW="90vw">
            <ModalHeader>Add New Seat</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <AddSeatForm
                roomId={roomId}
                rowNum={rowNum}
                colNum={colNum}
                onClose={onSeatModalClose}
              />
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  }

  if (!seats || seats.length === 0) {
    return (
      <div
        className="md:px-6 py-4 px-2 rounded md:mb-8 w-full"
        style={{ backgroundColor: boxBg }}
      >
        <p className="text-center" style={{ color: "red" }}>
          Room này chưa có ghế, vui lòng thêm ghế
        </p>
        <div className="flex justify-end mt-5">
          <button
            className="px-4 py-2 rounded border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500 hover:text-white transition duration-300 w-full"
            onClick={onSeatModalOpen}
          >
            Add Seat
          </button>
        </div>
        <Modal isOpen={isSeatModalOpen} onClose={onSeatModalClose} size="xl">
          <ModalOverlay />
          <ModalContent maxW="90vw">
            <ModalHeader>Add New Seat</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <AddSeatForm roomId={roomId} rowNum={rowNum} colNum={colNum} />
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  }

  const seatLayout = Array.from({ length: rowNum || 0 }, () =>
    Array(colNum || 0).fill(null)
  );

  if (seatLayout.length > 0 && seatLayout[0].length > 0) {
    seats.forEach((seat) => {
      const rowIndex = seat.rowSeat - 1;
      const colIndex = seat.colSeat - 1;

      if (
        seatLayout[rowIndex] &&
        seatLayout[rowIndex][colIndex] !== undefined
      ) {
        seatLayout[rowIndex][colIndex] = seat;
      }
    });
  }

  return (
    <>
      <p className="text-s text-center" style={{ color: textColor }}>
        Màn hình
      </p>
      <div className="border-2 border-orange-500 mt-3"></div>
      <div
        className="md:px-6 py-4 px-2 rounded md:mb-8 w-full"
        style={{ backgroundColor: boxBg }}
      >
        <div className="md:block flex flex-wrap justify-center w-full h-full overflow-auto">
          <ul className="seat__layout-rows md:mb-8 w-auto grid grid-cols-1 items-center flex-auto text-o">
            {seatLayout.map((row, i) => {
              const rowLabel = String.fromCharCode(65 + i);
              return (
                <li
                  key={i}
                  className="flex justify-between mb-3 md:gap-0 gap-1 flex-nowrap"
                >
                  <div
                    className="text-sm font-semibold flex-none w-5 text-left"
                    style={{ color: textColor }}
                  >
                    {rowLabel}
                  </div>
                  <div className="flex md:gap-2 gap-1 grow justify-center min-w-[398px] flex-1">
                    {row.map((seat, colIndex) => {
                      if (!seat) {
                        return (
                          <div
                            key={colIndex}
                            className="md:h-8 h-6 border rounded md:text-s text-[10px] md:w-8 w-6 shadow-sm"
                          ></div>
                        );
                      }

                      // Kiểm tra trạng thái ghế
                      const isInactive = seat?.status === "Inactive";
                      const isSeatSelected = isSelected(seat);

                      let seatClass =
                        "border-gray-400 hover:bg-green-100 hover:border-green-500";
                      if (isInactive && !isSeatSelected) {
                        seatClass = "bg-gray-300 border-gray-300"; // Ghế inactive sẽ có màu xám nhạt hơn
                      } else if (isSeatSelected) {
                        seatClass = "bg-green-500 border-green-500"; // Ghế được chọn sẽ có màu xanh
                      } else if (seat.type === "VIP") {
                        seatClass = "bg-red-500 border-red-500";
                      } else if (seat.type === "Couple") {
                        seatClass = "bg-blue-500 border-blue-500";
                      }

                      return (
                        <button
                          key={colIndex}
                          className={`md:h-8 h-6 border rounded md:text-s text-[10px] transition duration-300 ease-in-out ${seatClass} md:w-8 w-6 shadow-sm`}
                          onClick={() => handleSeatClick(seat)}
                        >
                          <span
                            className={`inline-block md:w-8 w-6 text-center`}
                            style={{
                              color: textColor, // Áp dụng textColor cho tên ghế
                            }}
                          >
                            {seat.name || `${rowLabel}${colIndex + 1}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div
                    className="text-sm font-semibold flex-none w-5 text-right"
                    style={{ color: textColor }}
                  >
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
            leftIcon={
              <span className="w-5 h-5 bg-red-500 inline-block rounded-full"></span>
            }
          >
            Seat VIP
          </Button>
          <Button
            variant="outline"
            colorScheme="blue"
            size="sm"
            leftIcon={
              <span className="w-5 h-5 bg-blue-500 inline-block rounded-full"></span>
            }
          >
            Seat Couple
          </Button>
        </div>
        <div className="flex justify-between mt-4 gap-5">
          <Button
            bg="transparent"
            color="blue.500"
            border="1px solid"
            borderColor="blue.500"
            _hover={{ bg: "blue.500", color: "white" }}
            _active={{ bg: "blue.600", color: "white" }}
            borderRadius="md"
            boxShadow="md"
            px={10} // Tăng độ rộng của nút
            py={3}
            w={"full"}
            onClick={handleEditSeat} // Trigger EditSeatForm modal
          >
            Edit Seat
          </Button>
        </div>
      </div>

      {/* Modal for EditSeatForm */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Seat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EditSeatForm seatId={selectedSeatId} onClose={handleSave} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
