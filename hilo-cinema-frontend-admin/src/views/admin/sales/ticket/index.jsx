import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  Text,
  Select,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "reduxHilo/actions/customerAction";
import { fetchRooms } from "reduxHilo/actions/roomAction";
import { fetchTheaters } from "reduxHilo/actions/theaterAction";
import { fetchMovies } from "reduxHilo/actions/movieAction";
import { fetchSchedulesByMovieId, clearSchedules } from "reduxHilo/actions/scheduleAction";
import { selectTheater, selectMovie, selectSchedule, selectRoom, selectCustomer, selectFood, selectSeat } from "reduxHilo/actions/bookingAction";
import TopCustomerTable from "./components/TableTopCustomers";
import Card from "components/card/Card.js";
import SeatList from "./components/SeatList";
import TopFoodTable from "./components/Concessions";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Ticket() {
  const dispatch = useDispatch();
  const history = useHistory();


  const { movies } = useSelector((state) => state.movie);
  const { user, token } = useSelector((state) => state.auth);
  const { loading, customers, error } = useSelector((state) => state.customer);
  const { theaters } = useSelector((state) => state.theater);
  const { rooms } = useSelector((state) => state.room);
  const { schedules } = useSelector((state) => state.schedule);
  const booking = useSelector((state) => state.booking);

  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchRooms());
      dispatch(fetchCustomers());
      dispatch(fetchTheaters());
      dispatch(fetchMovies());
    }
  }, [dispatch, token]);

  // UseEffect để log thông tin booking khi nó thay đổi
  useEffect(() => {
    console.log("Current booking details:", booking);
  }, [booking]);

  const handleTheaterChange = (e) => {
    const selectedTheaterId = parseInt(e.target.value, 10);
    setSelectedTheater(selectedTheaterId);
    dispatch(selectTheater(selectedTheaterId));
    setSelectedMovie(null);
    setSelectedSchedule(null);
    setSelectedRoom(null);
  };

  const handleMovieChange = (e) => {
    const selectedMovieId = parseInt(e.target.value, 10);
    setSelectedMovie(selectedMovieId);
    dispatch(selectMovie(selectedMovieId));
    setSelectedSchedule(null);
    setSelectedRoom(null);

    dispatch(clearSchedules());

    if (selectedMovieId) {
      dispatch(fetchSchedulesByMovieId(selectedMovieId))
        .then(response => {
          if (response && response.data && response.data.length > 0) {
            // Do nothing if schedules are available
          } else {
            setSelectedSchedule(null);
          }
        })
        .catch(() => {
          setSelectedSchedule(null);
        });
    }
  };

  const handleScheduleChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedSchedule(selectedValue);
    dispatch(selectSchedule(selectedValue));

    const selectedScheduleObj = schedules.find(
      (schedule) => `${schedule.date}-${schedule.time}` === selectedValue
    );

    if (selectedScheduleObj && selectedScheduleObj.roomId) {
      const filteredRooms = rooms.filter(
        (room) => room.id === selectedScheduleObj.roomId
      );
      setSelectedRoom(filteredRooms.length > 0 ? filteredRooms[0] : null);
      dispatch(selectRoom(filteredRooms.length > 0 ? filteredRooms[0].id : null));
    } else {
      setSelectedRoom(null);
      dispatch(selectRoom(null));
    }
  };

  const handleRoomChange = (e) => {
    const selectedRoomId = parseInt(e.target.value, 10);
    const room = rooms.find((room) => room.id === selectedRoomId);
    setSelectedRoom(room);
    dispatch(selectRoom(selectedRoomId));
  };

  const handleSeatSelect = (seatIds) => {
    dispatch(selectSeat(seatIds));
  };

  const handleSelectCustomer = (customerId) => {
    dispatch(selectCustomer(customerId));
  };

  const handleSelectFood = (foodId) => {
    dispatch(selectFood(foodId));
  };

  const handleContinue = () => {
    console.log("Final booking details before payment:", booking);
    setIsModalOpen(true);
  };

  const roomOptions = useMemo(() => {
    if (selectedTheater) {
      let filteredRooms = rooms.filter((room) => room.theaterId === selectedTheater);

      if (selectedSchedule) {
        const selectedScheduleObj = schedules.find(
          (schedule) => `${schedule.date}-${schedule.time}` === selectedSchedule
        );
        if (selectedScheduleObj && selectedScheduleObj.roomId) {
          filteredRooms = filteredRooms.filter(
            (room) => room.id === selectedScheduleObj.roomId
          );
        }
      }

      return filteredRooms.map((room) => ({
        value: room.id,
        label: `${room.name}`,
      }));
    }
    return [];
  }, [rooms, selectedTheater, selectedSchedule]);

  const theaterOptions = useMemo(() => {
    return theaters.map((theater) => ({
      value: theater.id,
      label: theater.name,
    }));
  }, [theaters]);

  const movieOptions = useMemo(() => {
    return movies.map((movie) => ({
      value: movie.id,
      label: movie.title,
    }));
  }, [movies]);

  const scheduleOptions = useMemo(() => {
    if (!selectedMovie || !schedules || schedules.length === 0) {
      return [];
    }

    const uniqueSchedules = schedules.reduce((acc, schedule) => {
      const key = `${schedule.date} - ${schedule.time}`;
      if (!acc.some(item => item.date === schedule.date && item.time === schedule.time)) {
        acc.push(schedule);
      }
      return acc;
    }, []);

    return uniqueSchedules.map((schedule) => ({
      value: `${schedule.date} - ${schedule.time}`,
      label: `${schedule.date} - ${schedule.time}`,
      roomId: schedule.roomId,
    }));
  }, [schedules, selectedMovie]);

  const handlePaymentConfirm = () => {
    // Tách selectedSchedule thành scheduleDate và scheduleTime
    const [scheduleDate, scheduleTime] = selectedSchedule.split(' - ');

    history.push({
      pathname: '/payment-confirm',
      state: {
        theaterId: selectedTheater,
        movieId: selectedMovie,
        roomId: selectedRoom ? selectedRoom.id : null,
        scheduleId: selectedSchedule,
        scheduleDate, // Truyền scheduleDate
        scheduleTime, // Truyền scheduleTime
        selectedSeats: booking.selectedSeats,
        customerId: booking.customerId,
        totalAmount: booking.totalAmount
      }
    });
  };

  const isReadyToContinue = useMemo(() => {
    return (
      selectedTheater !== null &&
      selectedMovie !== null &&
      selectedSchedule !== null &&
      selectedRoom !== null &&
      booking.selectedSeats.length > 0 &&
      booking.customerId !== null
    );
  }, [selectedTheater, selectedMovie, selectedSchedule, selectedRoom, booking.selectedSeats, booking.customerId]);

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}
      >
        <Flex
          flexDirection="column"
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}
        >
          <Flex mb={4}>
            <Select
              placeholder="Select Theater"
              mr={4}
              onChange={handleTheaterChange}
            >
              {theaterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              placeholder="Select Movie"
              mr={4}
              onChange={handleMovieChange}
              isDisabled={!selectedTheater}
            >
              {movieOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              placeholder="Select Schedule"
              mr={4}
              onChange={handleScheduleChange}
              isDisabled={!selectedMovie || schedules.length === 0}
            >
              {scheduleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              placeholder="Select Room"
              value={selectedRoom ? selectedRoom.id : ""}
              onChange={handleRoomChange}
              mr={4}
              isDisabled={!selectedSchedule}
            >
              {roomOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Flex>

          {selectedRoom && (
            <SeatList
              roomId={selectedRoom.id}
              rowNum={selectedRoom.rowNum}
              colNum={selectedRoom.colNum}
              onSelectSeats={handleSeatSelect}
            />
          )}
        </Flex>

        <Flex
          flexDirection="column"
          gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}
        >
          <Card px="0px" mb="20px">
            <TopCustomerTable
              customers={customers}
              loading={loading}
              error={error}
              onSelectCustomer={handleSelectCustomer}
            />
          </Card>
          {/* <Card px="0px" mb="20px">
            <TopFoodTable
              foods={foodData}
              loading={foodLoading}
              error={foodError}
              onSelectFood={handleSelectFood}
            />
          </Card> */}
        </Flex>
      </Grid>
      {/* Button handlePaymentConfirm */}
      {isReadyToContinue && (
        <button
          className="px-4 py-2 rounded border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500 hover:text-white transition duration-300 w-full"
          onClick={handlePaymentConfirm}
        >
          Continue
        </button>
      )}
    </Box>
  );
}
