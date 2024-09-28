import { useSelector } from 'react-redux';
import PropTypes from "prop-types";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setMovieBooking } from '../../redux/actions/bookingAction';

const BookingSummary = (props) => {
    const dispatch = useDispatch();
    const totalAmount = useSelector((state) => state.booking.totalAmount);
    const selectedSeats = useSelector((state) => state.booking.selectedSeats);
    const foodList = useSelector((state) => state.booking.foodList);
    const { account } = useSelector((state) => state.auth)
    console.log(account.id)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(setMovieBooking(props.movieBooking));
    }, [dispatch, props.movieBooking]);

    const generateRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const handlePayment = async () => {
        setLoading(true);

        const seatIds = selectedSeats.map(seat => seat.seatId);
        const foodRequests = foodList
            .filter(item => item.quantity > 0)
            .map(item => ({
                foodId: item.id,
                quantity: item.quantity,
            }));

        const movieDate = new Date(props.movieBooking.date);
        const timeParts = props.movieBooking.time.split(':');
        const movieTime = new Date();
        movieTime.setHours(timeParts[0], timeParts[1]);

        const paymentRequest = {
            orderId: generateRandomNumber(1000, 9999),
            fullName: "Nguyễn Văn A",
            description: "Thanh toán vé xem phim",
            amount: totalAmount,
            createdDate: new Date().toISOString().split('T')[0],
            invoice: {
                createdDate: new Date().toISOString().split('T')[0],
                customerId: account.id,
                employeeId: 0,
                promotionId: null,
                paymentMethod: "VNPAY",
                total: totalAmount,
                seatIds: seatIds,
                foodRequests: foodRequests,
                schedule: {
                    movieId: props.movieBooking.movieId,
                    date: movieDate.toISOString().split('T')[0],
                    time: movieTime.toTimeString().split(' ')[0],
                }
            },
        };

        console.log(paymentRequest);

        try {
            const response = await axios.post('http://localhost:8000/PaymentService/createInvoice', paymentRequest);
            const { redirectUrl } = response.data;

            // Redirect user to VNPay payment page
            window.location.href = redirectUrl;
        } catch (err) {
            console.log('Failed to initiate payment.');
            console.error(err);
        } finally {
            setLoading(false); // Kết thúc tải
        }
    };


    const selectedFood = foodList
        .filter(item => item.quantity > 0) // Keep only items with quantity > 0
        .map(item => ({
            foodId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
        }));
    console.log(selectedFood);

    console.log(totalAmount);
    return (
        <div className="booking__summary md:mb-4">
            <div className="h-[6px] bg-primary rounded-t-lg"></div>
            <div className="bg-white p-4 grid grid-cols-3 xl:gap-2 items-center">
                <div className="row-span-2 md:row-span-1 xl:row-span-2 block md:hidden xl:block">
                    <img alt="Chờ Người Nơi Pháo Hoa Rực Rỡ" loading="lazy" width="100" height="150" decoding="async" data-nimg="1" className="xl:w-full xl:h-full md:w-[80px] md:h-[120px] w-[90px] h-[110px] rounded object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" src="https://cdn.galaxycine.vn/media/2024/6/14/abl-500_1718351220871.jpg" style={{ backgroundColor: "transparent" }} />
                </div>
                <div className="row-span-2 md:row-span-1 xl:row-span-2 hidden md:block xl:hidden">
                    <img alt="Chờ Người Nơi Pháo Rực Rỡ" loading="lazy" width="100" height="150" decoding="async" data-nimg="1" className=" w-[220px] h-[150px] rounded object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" src="https://cdn.galaxycine.vn/media/2024/6/14/abl-750_1718351221256.jpg" style={{ color: "transparent" }} />
                </div>
                <div className="flex-1 col-span-2 md:col-span-1 row-span-1 xl:col-span-2">
                    <h3 className="text-sm xl:text-base font-bold xl:mb-2 ">
                        {props.movieBooking.title}
                    </h3>
                    <p className="text-sm inline-block">TYPE</p>
                    <span> - </span>
                    <div className="xl:mt-2 ml-2 xl:ml-0 inline-block">
                        <span className="inline-flex items-center justify-center w-[38px] h-7 bg-primary rounded text-sm text-center text-white font-bold not-italic">
                            T16
                        </span>
                    </div>
                </div>
                <div className="col-span-2 md:col-span-1 xl:col-span-3">
                    <div>
                        <div className="xl:mt-4 text-sm xl:text-base">
                            <strong>{props.movieBooking.theaterName}</strong>
                            <span> - </span>
                            <span className="text-sm xl:text-base">{props.movieBooking.roomName}</span>
                        </div>
                        <div className="xl:mt-2 text-sm xl:text-base">
                            <span>Suất: </span>
                            <strong>{props.movieBooking.time}</strong>
                            <span> - </span>
                            <span className="capitalize text-sm">
                                <strong> {props.movieBooking.date}</strong>
                            </span>
                        </div>
                    </div>
                    <div className="xl:block hidden">
                        <div
                            className={`my-4 border-t border-black border-dashed ${selectedSeats.length === 0 ? 'hidden' : 'xl:block'}`}
                        >
                        </div>
                        {selectedSeats.map((seat, index) => (
                            <div key={index} className="flex justify-between text-sm mt-2">
                                <div>
                                    <strong>1x </strong>
                                    <span>{seat.seatType === "Normal" ? 'Ghế đơn' : 'Ghế đôi'}</span>
                                    <div>
                                        <span>Ghế: </span>
                                        <strong>{seat.seatName}</strong>
                                    </div>
                                </div>
                                <span className="inline-block font-bold ">75.000&nbsp;₫</span>
                            </div>
                        ))}
                    </div>
                    <div className="xl:block hidden">
                        <div
                            className={`my-4 border-t border-black border-dashed ${selectedFood.length === 0 ? 'hidden' : 'xl:block'}`}
                        >
                        </div>
                        {
                            selectedFood.map((food, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span>
                                        <strong>{food.quantity}x </strong>
                                        <span>{food.name}</span>
                                    </span>
                                    <span className="inline-block font-bold ">{food.quantity * food.price}&nbsp;₫</span>
                                </div>
                            ))
                        }
                    </div>
                    <div className="my-4 border-t border-black border-dashed xl:block hidden"></div>
                </div>
                <div className="xl:flex hidden justify-between col-span-3">
                    <strong className="text-base">Tổng cộng</strong>
                    <span className="inline-block font-bold text-primary">
                        {totalAmount.toLocaleString()}&nbsp;₫
                    </span>
                </div>
            </div>
            <div className="mt-8 xl:flex hidden">
                <button onClick={props.comeBack} className="w-1/2 mr-2 py-2 text-primary">
                    <span>Quay lại</span>
                </button>
                <button onClick={props.onContinue} className="w-1/2 ml-2 py-2 bg-primary text-white border rounded-md hover:bg-orange-20">
                    <span>Tiếp tục</span>
                </button>
                <button onClick={handlePayment} className="w-1/2 ml-2 py-2 bg-primary text-white border rounded-md hover:bg-orange-20 ">
                    <span>Thanh toán</span>
                </button>
            </div>
        </div>
    );
};

BookingSummary.propTypes = {
    onContinue: PropTypes.func,
    comeBack: PropTypes.func,
    movieBooking: PropTypes.object,
    seats: [
        {
            movie_id: PropTypes.number,
            date: PropTypes.date,
            time: PropTypes.time,
            seat_id: PropTypes.number,
        }
    ],
    foods: [
        {
            foodId: PropTypes.number,
            quantity: PropTypes.number,
        }
    ],
    invoice: {
        customerId: PropTypes.number,
        employeeId: 0,
        promotionId: null,
        paymentMethod: "VNPAY",
        total: 0,
        status: "Done",
        revenue_date: new Date().toISOString().split('T')[0],
    }
}


export default BookingSummary;
