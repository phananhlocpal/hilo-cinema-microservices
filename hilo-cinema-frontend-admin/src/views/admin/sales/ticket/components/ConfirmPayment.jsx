import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { fetchCustomers } from 'reduxHilo/actions/customerAction';
import { fetchFoods } from 'reduxHilo/actions/foodAction';
import { fetchMovies } from 'reduxHilo/actions/movieAction';
import { fetchRooms } from 'reduxHilo/actions/roomAction';
import { fetchTheaters } from 'reduxHilo/actions/theaterAction';
import { PaymentConfirmationModal } from './PaymentConfirmationModal';
import { addInvoice } from 'reduxHilo/actions/invoiceAction';
import { NavLink } from "react-router-dom";
import { Flex, Icon, Text } from '@chakra-ui/react';
import { FaChevronLeft } from "react-icons/fa";
function ConfirmPayment() {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const { loading, foods, error } = useSelector((state) => state.food);
    const { movies } = useSelector((state) => state.movie);
    const { customers } = useSelector((state) => state.customer);
    const { theaters } = useSelector((state) => state.theater);
    const { rooms } = useSelector((state) => state.room);
    const { seats } = useSelector((state) => state.seat);
    const { user, token } = useSelector((state) => state.auth);
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        theaterId,
        movieId,
        roomId,
        scheduleId,
        scheduleDate, // Nhận scheduleDate
        scheduleTime, // Nhận scheduleTime
        selectedSeats = [],
        customerId
    } = location.state || {};

    useEffect(() => {
        dispatch(fetchFoods());
        dispatch(fetchRooms());
        dispatch(fetchCustomers());
        dispatch(fetchTheaters());
        dispatch(fetchMovies());
    }, [dispatch]);
    console.log(scheduleDate)
    console.log(scheduleTime)
    const theaterDetail = useMemo(() => {
        return theaters.find(theater => theater.id === theaterId) || {};
    }, [theaters, theaterId]);

    const movieDetails = useMemo(() => {
        return movies.find(movie => movie.id === movieId) || {};
    }, [movies, movieId]);

    const roomDetail = useMemo(() => {
        return rooms.find(room => room.id === roomId) || {};
    }, [rooms, roomId]);

    const seatPrices = {
        vip: 100000,
        couple: 150000,
        standard: 75000
    };

    const selectedSeatDetails = useMemo(() => {
        return selectedSeats.map(seat => {
            const seatId = seat.id;
            const foundSeat = seats.find(s => s.id === seatId);
            if (foundSeat && foundSeat.type) {
                return {
                    ...foundSeat,
                    price: seatPrices[foundSeat.type.toLowerCase()] || 0
                };
            } else {
                return { name: 'Unknown Seat', price: 0 };
            }
        });
    }, [seats, selectedSeats]);

    const totalSeatPrice = useMemo(() => {
        return selectedSeatDetails.reduce((total, seat) => {
            return total + (seat.price || 0);
        }, 0);
    }, [selectedSeatDetails]);

    const totalFoodPrice = useMemo(() => {
        return selectedFoods.reduce((total, food) => {
            return total + (food.price * food.quantity);
        }, 0);
    }, [selectedFoods]);
    const customerDetails = useMemo(() => {
        return customers.find(customer => customer.id === customerId) || {};
    }, [customers, customerId]);

    const handleAddFood = (food) => {
        setSelectedFoods(prevSelectedFoods => {
            const existingFood = prevSelectedFoods.find(f => f.id === food.id);
            if (existingFood) {
                return prevSelectedFoods.map(f =>
                    f.id === food.id ? { ...f, quantity: f.quantity + 1 } : f
                );
            } else {
                return [...prevSelectedFoods, { ...food, quantity: 1 }];
            }
        });
    };

    const handleRemoveFood = (food) => {
        setSelectedFoods(prevSelectedFoods => {
            const existingFood = prevSelectedFoods.find(f => f.id === food.id);
            if (existingFood && existingFood.quantity > 1) {
                return prevSelectedFoods.map(f =>
                    f.id === food.id ? { ...f, quantity: f.quantity - 1 } : f
                );
            } else {
                return prevSelectedFoods.filter(f => f.id !== food.id);
            }
        });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
    const totalPayment = totalSeatPrice + totalFoodPrice;
    const handlePaymentClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirmPayment = () => {
        const invoiceData = {
            orderId: 1,
            fullName: customerDetails.name,
            description: "Order description",
            amount: totalPayment,
            createdDate: new Date().toISOString().slice(0, 10), // "YYYY-MM-DD" format for DateOnly
            invoice: {
                createdDate: new Date().toISOString().slice(0, 10), // "YYYY-MM-DD" format for DateOnly
                employeeId: user.id,
                customerId: customerId,
                promotionId: null, // or a valid ID if you have one
                paymentMethod: "Cash",
                total: totalPayment,
                seatIds: selectedSeats.map(seat => seat.id),
                foodRequests: selectedFoods.map(food => ({
                    foodId: food.id,
                    quantity: food.quantity
                })),
                schedule: {
                    movieId: movieId,
                    date: scheduleDate, // ensure this is in "YYYY-MM-DD" format
                    time: scheduleTime // ensure this is in "HH:MM:SS" format
                }
            }
        };

        console.log("Sending invoice data:", invoiceData);

        dispatch(addInvoice(invoiceData)).then(() => {
            setIsModalOpen(false);
            history.push('/payment-success');
        }).catch((error) => {
            if (error.response) {
                console.error("Error response:", error.response.data);
            } else {
                console.error("Error:", error.message);
            }
        });
    };


    return (
        <section className="bg-white py-8 antialiased md:py-16" >
            <div style={{marginLeft : "30px"}}>
                <NavLink
                    to='admin/sales/ticket'
                    style={() => ({
                        width: "fit-content",
                        marginTop: "40px",
                    })}>
                    <Flex
                        align='center'
                        ps={{ base: "25px", lg: "0px" }}
                        pt={{ lg: "0px", xl: "0px" }}
                        w='fit-content'>
                        <Icon
                            as={FaChevronLeft}
                            me='12px'
                            h='13px'
                            w='8px'
                            color='secondaryGray.600'
                        />
                        <Text ms='0px' fontSize='sm' color='secondaryGray.600'>
                            Back to Dashboard
                        </Text>
                    </Flex>
                </NavLink>
                {/* Payment Information */}
                <div className="mb-8 mt-3">
                    <h2 className="text-xl font-semibold text-gray-900">PAYMENT INFORMATION</h2>
                    <p className="mt-4 text-gray-700"><strong>Full name:</strong> {customerDetails.name}</p>
                    <p className="text-gray-700"><strong>Phone:</strong> {customerDetails.phone}</p>
                    <p className="text-gray-700"><strong>Email:</strong> {customerDetails.email}</p>
                    <p className="mt-4 text-gray-900"><strong>Seats Selected:</strong></p>
                    <ul className="list-disc list-inside text-gray-900">
                        {selectedSeatDetails.map((seat, index) => (
                            <li key={index}>{seat?.name || 'Unknown Seat'} - {seat?.price || 0} VND</li>
                        ))}
                    </ul>
                    <p className="mt-4 text-gray-900"><strong>Total Seat Price:</strong> {totalSeatPrice} VND</p>
                </div>

                {/* Combo Offers */}
                <h3 className="text-xl font-semibold text-gray-900 mb-6">COMBO OFFERS</h3>
                <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                    <div className="w-full flex-none lg:w-7/12">
                        <div className="space-y-6">
                            {foods.map((food) => (
                                <div key={food.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                                    <div className="flex items-center">
                                        <img src={`data:image/jpeg;base64,${food.imgBase64}`} alt={food.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px' }} />
                                        <div className="ml-4">
                                            <h4 className="font-semibold text-gray-900">{food.name}</h4>
                                            <p className="text-sm text-gray-500">{food.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-base font-bold text-gray-900 mr-4">${food.price}</p>
                                        <div className="flex items-center">
                                            <button type="button" className="h-8 w-8 text-gray-500 border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none rounded-md" onClick={() => handleRemoveFood(food)}>
                                                -
                                            </button>
                                            <input type="text" className="w-10 text-center border-0 bg-transparent text-sm font-medium text-gray-900" value={selectedFoods.find(f => f.id === food.id)?.quantity || 0} readOnly />
                                            <button type="button" className="h-8 w-8 text-gray-500 border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none rounded-md" onClick={() => handleAddFood(food)}>
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full flex-1 lg:w-5/12 mt-6 lg:mt-0">
                        <div className="booking__summary md:mb-4">
                            <div className="h-[6px] bg-primary rounded-t-lg"></div>
                            <div className="bg-white p-4 grid grid-cols-3 xl:gap-2 items-center">
                                <div className="row-span-2 md:row-span-1 xl:row-span-2 block md:hidden xl:block">
                                    {movieDetails.imgSmall && (
                                        <img alt={movieDetails.imgSmall} loading="lazy" width="120" height="200" decoding="async" data-nimg="1" className=" w-[220px] h-[150px] rounded object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" src={`data:image/jpeg;base64,${movieDetails.imgSmall}`} style={{ color: "transparent" }} />
                                    )}
                                </div>
                                <div className="row-span-2 md:row-span-1 xl:row-span-2 hidden md:block xl:hidden">
                                    <img alt={movieDetails.imgSmall} loading="lazy" width="100" height="150" decoding="async" data-nimg="1" className=" w-[220px] h-[150px] rounded object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" src={`data:image/jpeg;base64,${movieDetails.imgSmall}`} style={{ color: "transparent" }} />
                                </div>
                                <div className="flex-1 col-span-2 md:col-span-1 row-span-1 xl:col-span-2">
                                    <h3 className="text-sm xl:text-base font-bold xl:mb-2 ">
                                        {movieDetails.title}
                                    </h3>
                                    <p className="text-sm inline-block">TYPE</p>
                                    <span> - </span>
                                    <div className="xl:mt-2 ml-2 xl:ml-0 inline-block">
                                        <span className="inline-flex items-center justify-center w-[38px] h-7 bg-primary rounded text-sm text-center text-white font-bold not-italic">
                                            {/* Bạn có thể chèn loại vé tại đây, nếu có */}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-2 md:col-span-1 xl:col-span-3">
                                    <div>
                                        <div className="xl:mt-4 text-sm xl:text-base">
                                            <strong>{theaterDetail.name}</strong>
                                            <span> - </span>
                                            <span className="text-sm xl:text-base">{roomDetail.name}</span>
                                        </div>
                                        <div className="xl:mt-2 text-sm xl:text-base">
                                            <span>Schedule: </span>
                                            <span className="capitalize text-sm">
                                                <strong>{scheduleId}</strong>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="xl:block hidden">
                                        <div
                                            className={`my-4 border-t border-black border-dashed ${selectedSeatDetails.length === 0 ? 'hidden' : 'xl:block'}`}
                                        >
                                        </div>
                                        {selectedSeatDetails.map((seat, index) => (
                                            <div key={index} className="flex justify-between text-sm mt-2">
                                                <div>
                                                    <strong>1x </strong>
                                                    <span>{seat.type === "standard" ? 'Standard' : (seat.type === "couple" ? 'Couple' : 'VIP')}</span>
                                                    <div>
                                                        <span>Seat: </span>
                                                        <strong>{seat.name}</strong>
                                                    </div>
                                                </div>
                                                <span className="inline-block font-bold ">{seat.price.toLocaleString()}&nbsp;₫</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="xl:block hidden">
                                        <div
                                            className={`my-4 border-t border-black border-dashed ${selectedFoods.length === 0 ? 'hidden' : 'xl:block'}`}
                                        >
                                        </div>
                                        {selectedFoods.map((food, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span>
                                                    <strong>{food.quantity}x </strong>
                                                    <span>{food.name}</span>
                                                </span>
                                                <span className="inline-block font-bold ">{(food.quantity * food.price).toLocaleString()}&nbsp;₫</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="my-4 border-t border-black border-dashed xl:block hidden"></div>
                                </div>
                                <div className="xl:flex hidden justify-between col-span-3">
                                    <strong className="text-base">Total</strong>
                                    <span className="inline-block font-bold text-primary">
                                        {totalPayment.toLocaleString()}&nbsp;₫
                                    </span>
                                </div>
                            </div>
                            <div className="mt-8 xl:flex hidden">
                                <button
                                    className="px-4 py-2 rounded border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500 hover:text-white transition duration-300 w-full"
                                    onClick={() => history.goBack()}
                                >
                                    Back
                                </button>

                                <button
                                    className="px-4 py-2 rounded border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500 hover:text-white transition duration-300 w-full"
                                    onClick={handlePaymentClick}
                                >
                                    Payment
                                </button>
                            </div>
                            <PaymentConfirmationModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                onConfirm={handleConfirmPayment}
                            />
                        </div>
                        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:p-6">
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="voucher" className="mb-2 block text-sm font-medium text-gray-900"> Do you have a voucher or gift card? </label>
                                    <input type="text" id="voucher" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500" placeholder="" required />
                                </div>
                                <button type="submit" className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300">Apply Code</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ConfirmPayment;
