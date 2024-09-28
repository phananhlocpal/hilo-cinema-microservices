import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSeat, deselectSeat } from "../../../../../reduxHilo/actions/bookingAction";
import { fetchSeatsByRoom } from "../../../../../reduxHilo/actions/seatAction";
import { useColorModeValue } from "@chakra-ui/system";
import { Button } from "@chakra-ui/react";

export default function SeatList({ roomId, rowNum, colNum }) {
  const dispatch = useDispatch();
  const { seats, loading, error } = useSelector((state) => state.seat);
  const selectedSeats = useSelector((state) => state.booking.selectedSeats);

  useEffect(() => {
    if (roomId) {
      dispatch(fetchSeatsByRoom(roomId));
    }
  }, [dispatch, roomId]);

  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("black", "white");

  const handleSeatClick = (seat) => {
    if (seat.status === "Inactive") {
      return; // Do nothing if seat is inactive
    }

    if (isSelected(seat)) {
      dispatch(deselectSeat(seat.id));
    } else {
      dispatch(selectSeat(seat));
    }
  };

  const isSelected = (seat) => {
    return selectedSeats.some(selectedSeat => selectedSeat.id === seat.id);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
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

                      const isInactive = seat.status === "Inactive";
                      const isSeatSelected = isSelected(seat);

                      let seatClass =
                        "border-gray-400 hover:bg-green-100 hover:border-green-500";
                      if (isInactive && !isSeatSelected) {
                        seatClass = "bg-gray-300 border-gray-300";
                      } else if (isSeatSelected) {
                        seatClass = "bg-green-500 border-green-500";
                      } else if (seat.type === "vip") {
                        seatClass = "bg-red-500 border-red-500";
                      } else if (seat.type === "couple") {
                        seatClass = "bg-blue-500 border-blue-500";
                      }

                      return (
                        <button
                          key={colIndex}
                          className={`md:h-8 h-6 border rounded md:text-s text-[10px] transition duration-300 ease-in-out ${seatClass} md:w-8 w-6 shadow-sm`}
                          onClick={() => handleSeatClick(seat)}
                          disabled={isInactive}
                        >
                          <span
                            className={`inline-block md:w-8 w-6 text-center`}
                            style={{
                              color: textColor,
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
            leftIcon={<span className="w-5 h-5 bg-red-500 inline-block rounded-full"></span>}
          >
            Seat VIP
          </Button>
          <Button
            variant="outline"
            colorScheme="blue"
            size="sm"
            leftIcon={<span className="w-5 h-5 bg-blue-500 inline-block rounded-full"></span>}
          >
            Seat couple
          </Button>
        </div>
      </div>
    </>
  );
}
