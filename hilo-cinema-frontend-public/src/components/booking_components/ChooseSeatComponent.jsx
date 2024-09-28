import  { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { selectSeat, deselectSeat } from "../../redux/actions/bookingAction";

const ChooseSeatComponent = ({ movieId, date, theaterId, roomId, time }) => {
  const dispatch = useDispatch();
  const selectedSeats = useSelector((state) => state.booking.selectedSeats);

  const [cinemaData, setCinemaData] = useState(null);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(`http://localhost:8000/ScheduleService/getSeatsBySchedule?movieId=${movieId}&date=${date}&theaterId=${theaterId}&roomId=${roomId}&time=${time}`);
        const data = await response.json();
        console.log("Seat after fetch: ", data)
        setCinemaData({
          row: data.room.rowNum,
          col: data.room.colNum,
          seats: data.seats.map(seat => ({
            seatId: seat.seat.id,  
            row: String.fromCharCode(65 + (seat.seat.rowSeat - 1)), 
            col: seat.seat.colSeat, 
            name: `${String.fromCharCode(65 + (seat.seat.rowSeat - 1))}${seat.seat.colSeat}`, 
            type: seat.seat.type,
            status: seat.seat.status,
            invoiceId: seat.invoiceId,  
          })),
        });
        console.log(cinemaData);
      } catch (error) {
        console.error("Error fetching seat data:", error);
      }
    };

    fetchSeats();
  }, [movieId, date, theaterId, roomId, time]);

  const handleSeatClick = (seat) => {
    const newSeat = {
      seatType: seat.type,
      seatId: seat.seatId,
      seatName: seat.name,
    };
    console.log(newSeat)
    if (isSelected(newSeat)) {
      dispatch(deselectSeat(newSeat));
    } else {
      dispatch(selectSeat(newSeat));
    }
  };

  const isSelected = (seat) => {
    return selectedSeats.some(
      (selectedSeat) => selectedSeat.seatId === seat?.seatId
    );
  };

  if (!cinemaData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white md:px-6 py-4 px-2 rounded md:mb-8 w-full">
      <div className="md:block flex flex-wrap justify-center w-full h-full overflow-auto">
        <ul className="seat__layout-rows md:mb-8 w-auto grid grid-cols-1 items-center flex-auto text-o">
          {[...Array(cinemaData.row)].map((_, i) => {
            const rowLabel = String.fromCharCode(65 + cinemaData.row - 1 - i);
            return (
              <li
                key={i}
                className="flex justify-between mb-3 md:gap-0 gap-1 flex-nowrap"
              >
                <div className="text-sm text-grey-40 font-semibold flex-none w-5 text-left">
                  {rowLabel}
                </div>
                <div className="flex md:gap-2 gap-1 grow justify-center min-w-[398px] flex-1">
                  {[...Array(cinemaData.col)].map((_, colIndex) => {
                    const seat = (cinemaData.seats || []).find(
                      (seat) =>
                        seat.row === rowLabel && seat.col === colIndex + 1
                    );

                    const isInvisible = seat?.status === "Inactive";
                    const isDisavailable = seat?.invoiceId !== null;
                    const isSelected = selectedSeats.some(
                      (selectedSeat) => selectedSeat.seatId === seat?.seatId
                    );

                    return (
                      <button
                        key={colIndex}
                        className={`md:h-5 h-4 border rounded md:text-s text-[10px] transition duration-200 ease-in-out ${isInvisible
                          ? "Invisible"
                          : isDisavailable
                            ? "bg-[#D0D0D0] border-[#D0D0D0]"
                            : isSelected
                              ? "text-white bg-primary border-primary"
                              : "text-white border-grey-20 xl:hover:bg-primary xl:hover:border-primary"
                          } md:w-5 w-4`}
                        disabled={isDisavailable}
                        onClick={() => handleSeatClick(seat)}
                      >
                        {!isInvisible && (
                          <span
                            className={`inline-block md:w-5 w-4 text-center ${isSelected ? "text-white" : "text-black"
                              }`}
                          >
                            {seat?.name}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="text-sm text-grey-40 font-semibold flex-none w-5 text-right">
                  {rowLabel}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="seat__layout-screen">
        <p className="text-s text-center text-grey-50">Màn hình</p>
        <div className="border-2 border-orange-10 mt-3"></div>
        <div className="text-sm flex md:flex-row flex-col-reverse justify-between items-center py-9 gap-2">
          <div className="flex gap-5">
            <div>
              <span className="w-5 h-5 rounded bg-grey-20 inline-block align-middle"></span>
              <span className="ml-2">Ghế đã bán</span>
            </div>
            <div>
              <span className="w-5 h-5 rounded bg-primary inline-block align-middle"></span>
              <span className="ml-2">Ghế đang chọn</span>
            </div>
          </div>
          <div className="flex gap-5">
            <div>
              <span className="w-5 h-5 rounded border border-yellow-10 inline-block align-middle"></span>
              <span className="ml-2">Ghế VIP</span>
            </div>
            <div>
              <span className="w-5 h-5 rounded border border-grey-20 inline-block align-middle"></span>
              <span className="ml-2">Ghế đơn</span>
            </div>
            <div>
              <span className="w-[46px] h-5 rounded border border-blue-10 inline-block align-middle"></span>
              <span className="ml-2">Ghế đôi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseSeatComponent;
