// create.jsx
import { useState, useEffect } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Select, Button, Spinner } from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";

const CreateMovieModal = ({ isOpen, onClose, fetchSchedule }) => {
    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState();
    const [selectedTheater, setSelectedTheater] = useState();
    const [selectedRoom, setSelectedRoom] = useState();
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(false);

    const [scrollBehavior] = useState('inside')

    const fetchTheaters = async () => {
        try {
            const response = await axios.get("http://localhost:8000/TheaterService");
            setTheaters(response.data);
        }
        catch (error) {
            console.error("Error fetching theaters:", error);
        }
    }
    const fetchMovie = async () => {
        try {
            const response = await axios.get("http://localhost:8000/MovieService");
            setMovies(response.data);
        }
        catch (error) {
            console.error("Error fetching movies:", error);
        }
    }
    const fetchRoomByTheaterId = async (theaterId) => {
        try {
            const response = await axios.get(`http://localhost:8000/RoomService/GetRoomByTheater/${theaterId}`);
            setRooms(response.data);
        }
        catch (error) {
            console.error("Error fetching rooms:", error);
        }
    }

    const handleChooseTheater = (theaterId) => {
        setSelectedTheater(theaterId);
        fetchRoomByTheaterId(theaterId);
    }

    const onSave = async () => {
        setLoading(true);

        const formattedDate = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
        const formattedTime = time; 
        const data = {
            theaterId: selectedTheater,
            roomId: selectedRoom,
            date: formattedDate,
            time: formattedTime,
            movieId: selectedMovie,
        };

        try {
            await axios.post("http://localhost:8000/ScheduleService/CreateSchedule", data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            onClose();
            fetchSchedule();
        } catch (error) {
            console.error("Error saving movie:", error.response ? error.response.data : error.message);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTheaters();
        fetchMovie();
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"} scrollBehavior={scrollBehavior}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Tạo lịch chiếu mới</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Rạp chiếu</FormLabel>
                        <Select
                            placeholder="Chọn rạp chiếu"
                            value={selectedTheater}
                            onChange={(e) => handleChooseTheater(e.target.value)}
                        >
                            {theaters.map((theater, index) => (
                                <option key={index} value={theater.id}>{theater.name}</option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Phòng chiếu</FormLabel>
                        <Select
                            placeholder="Chọn phòng chiếu"
                            value={selectedRoom}
                            onChange={(e) => setSelectedRoom(e.target.value)}>
                            {rooms.map((room, index) => (
                                <option key={index} value={room.id}>{room.name}</option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Ngày chiếu</FormLabel>
                        <Input type="date" value={date}
                            onChange={(e) => setDate(e.target.value)} />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Phim chiếu</FormLabel>
                        <Select
                            placeholder="Chọn phim chiếu"
                            value={selectedMovie}
                            onChange={(e) => setSelectedMovie(e.target.value)}>
                            {movies.map((movie, index) => (
                                <option key={index} value={movie.id}>{movie.title}</option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Giờ chiếu</FormLabel>
                        <Input type="time" step="1" amPmAriaLabel="false" lang="en-GB" value={time}
                            onChange={(e) => setTime(e.target.value)} />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={onSave}
                            isDisabled={loading} 
                        >
                            {loading ? (
                                <Spinner size="sm" />
                            ) : (
                                <span>Save</span>
                            )}
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

CreateMovieModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchSchedule: PropTypes.func.isRequired,
}
export default CreateMovieModal;
