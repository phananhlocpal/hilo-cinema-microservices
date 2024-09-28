// import libraries
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

// Import componnents
import BookingSummary from '../components/booking_components/BookingSumary';
import ChooseSeatTab from './booking_tabs/ChooseSeatTab';
import ChooseFoodTab from './booking_tabs/ChooseFoodTab';
import PaymentTab from './booking_tabs/PaymentTab';


const BookingPage = () => {
  const location = useLocation();
  const { movieId, title, date, theaterId, theaterName, roomId, roomName, time } = location.state || {};

  console.log(movieId, title, date, theaterId, roomId, time);
  const [currentTab, setCurrentTab] = useState('chooseSeat');

  const movieBooking = {
    movieId: movieId,
    title: title,
    date: date,
    theaterId: theaterId,
    theaterName: theaterName,
    roomId: roomId,
    roomName: roomName,
    time: time
  };

  const handleContinue = () => {
    switch (currentTab) {
      case 'chooseSeat':
        setCurrentTab('chooseFood');
        break;
      case 'chooseFood':
        setCurrentTab('payment');
        break;
      case 'payment':
        setCurrentTab('confirm');
        break;
      default:
        break;
    }
  };

  return (
    <div className="booking__wrapper bg-white-10 md:pb-0">
      <div className="booking__progress-bar flex justify-center items-center flex-nowrap bg-white relative md:mb-8 mb-0 w-full overflow-auto">
        <ul className="flex justify-center items-center text-grey-20 md:text-base text-[12px] font-semibold w-full flex-nowrap">
          <li className="pt-4 mb-4 pl-0 text-blue-20">
            <button className="md:mx-3 mx-1 ml-0">
              Chọn phim / Rạp / Suất
            </button>
            <div className="relative mt-4 h-[2px] before:inline-block before:w-full before:absolute before:left-0 before:h-[2px] before:bg-grey-30 after:inline-block after:absolute after:left-0 after:h-[2px] after:bg-blue-10 after:w-full"></div>
          </li>
          <li className="pt-4 mb-4 pl-0 text-blue-10">
            <button className="md:mx-3 mx-1">Chọn ghế</button>
            <div className="relative mt-4 h-[2px] before:inline-block before:w-full before:absolute before:left-0 before:h-[2px] before:bg-grey-30"></div>
          </li>
          <li className="pt-4 mb-4 pl-0">
            <button className="md:mx-3 mx-1">Chọn thức ăn</button>
            <div className="relative mt-4 h-[2px] before:inline-block before:w-full before:absolute before:left-0 before:h-[2px] before:bg-grey-30"></div>
          </li>
          <li className="pt-4 mb-4 pl-0">
            <button className="md:mx-3 mx-1">Thanh toán</button>
            <div className="relative mt-4 h-[2px] before:inline-block before:w-full before:absolute before:left-0 before:h-[2px] before:bg-grey-30"></div>
          </li>
          <li className="pt-4 mb-4 pl-0">
            <button className="md:mx-3 mx-1 mr-0">Xác nhận</button>
            <div className="relative mt-4 h-[2px] before:inline-block before:w-full before:absolute before:left-0 before:h-[2px] before:bg-grey-30"></div>
          </li>
        </ul>
      </div>
      <div className="md:container md:mx-auto screen1390:max-w-screen-xl xl:max-w-screen-screen1200 lg:max-w-4xl md:max-w-4xl md:px-0 sm:px-[45px] grid xl:grid-cols-3 grid-cols-1">
        {currentTab === 'chooseSeat' && (
          <ChooseSeatTab movieId={movieId} date={date} theaterId={theaterId} roomId={roomId} time={time} />
        )}
        {currentTab === 'chooseFood' && (
          <ChooseFoodTab />
        )}
        {currentTab === 'payment' && (
          <PaymentTab />
        )}
        {/* {currentTab === 'confirm' && (
        <ConfirmTab />
      )} */}
        <div className="col-span-1 xl:pl-4 xl:order-none order-first py-4">
          <BookingSummary onContinue={handleContinue} movieBooking={movieBooking}/>
          <div className="fixed bottom-0 left-0 w-full z-100 bg-white xl:hidden transition-all duration-500 ease-in-out overflow-hidden max-h-[90vh] h-max min-h-max pb-12 pt-2 border border-[#DFDFDF] rounded-t-xl opacity-100">
            <div className="rounded opacity-100 w-full">
              <img alt="Icon show" loading="lazy" width="45" height="20" decoding="async" data-nimg="1" className="absolute -top-[6%] left-[50%] -translate-x-[50%] brightness-90 grayscale-[20%] z-100" src="/_next/static/media/delete.addc939e.png" style={{ backgroundColor: 'transparent' }} />
            </div>
            <div className="grid grid-cols-3 items-center px-4 mb-2 transition relative overflow-hidden opacity-100">
              <div className="col-span-3"></div>
              <div className="fixed bottom-0">
                <div className="justify-start items-center gap-1 flex col-span-2 w-full h-14 fixed bottom-0 left-4 bg-white">
                  <strong className="text-sm font-normal text-grey-10">
                    Tổng cộng:{" "}
                  </strong>
                  <span className="inline-block font-bold text-primary">
                    {/* {₫totalAmount.toLocaleString()}&nbsp; */}
                  </span>
                </div>
                <div className="text-right fixed bottom-0 right-4 h-14 flex items-center">
                  <div>
                    <button className="w-[65px] h-10 py-2 bg-transparent text-primary text-sm rounded-md">
                      <span>Quay lại</span>
                    </button>
                    <button className="w-[80px] h-10 py-2 bg-primary text-white border text-sm rounded-md hover:bg-orange-20">
                      <span>Tiếp tục</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
