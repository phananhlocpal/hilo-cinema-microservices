import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "reduxHilo/actions/customerAction";
import { fetchRoomsByTheaterId } from "reduxHilo/actions/roomAction";
import { fetchTheaters } from "reduxHilo/actions/theaterAction";
import SeatList from "./components/SeatList";
import AddRoomForm from "./components/AddRoomForm";

export default function Rooms() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { theaters } = useSelector((state) => state.theater);
  const { rooms } = useSelector((state) => state.room);

  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(fetchTheaters());
      dispatch(fetchCustomers());
    }
  }, [dispatch, token]);

  const handleTheaterChange = (e) => {
    const theaterId = e.target.value;
    setSelectedTheater(theaterId);
    setSelectedRoom(null);
    if (theaterId) {
      dispatch(fetchRoomsByTheaterId(theaterId));
    }
  };

  const handleRoomChange = (e) => {
    const selectedRoomId = parseInt(e.target.value, 10);
    const room = rooms.find((room) => room.id === selectedRoomId);
    setSelectedRoom(room);
  };

  const roomOptions = useMemo(() => {
    // Hiển thị room tương ứng với theater đã chọn
    if (selectedTheater) {
      return rooms.map((room) => ({
        value: room.id,
        label: `${room.name}`,
      }));
    }
    return [];
  }, [rooms, selectedTheater]);

  const theaterOptions = useMemo(() => {
    return theaters.map((theater) => ({
      value: theater.id,
      label: theater.name,
    }));
  }, [theaters]);

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Flex direction="column" mb="20px">
        {/* Combo Boxes */}
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
            placeholder="Select Room"
            value={selectedRoom ? selectedRoom.id : ""}
            onChange={handleRoomChange}
            mr={4}
            isDisabled={!selectedTheater}
          >
            {roomOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Button
            bg="transparent"
            color="blue.500"
            border="1px solid"
            borderColor="blue.500"
            _hover={{ bg: "blue.500", color: "white" }}
            _active={{ bg: "blue.600", color: "white" }}
            borderRadius="md"
            boxShadow="md"
            px={10}
            py={3}
            onClick={onModalOpen}
          >
            Add Room
          </Button>
        </Flex>

        {selectedRoom && (
          <SeatList
            roomId={selectedRoom.id}
            rowNum={selectedRoom.rowNum}
            colNum={selectedRoom.colNum}
          />
        )}
      </Flex>

      <AddRoomForm
        isOpen={isModalOpen}
        onClose={onModalClose}
        fetchRooms={() => dispatch(fetchRoomsByTheaterId(selectedTheater))}
        theaters={theaters}
      />
    </Box>
  );
}
