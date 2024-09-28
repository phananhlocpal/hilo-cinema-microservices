import { useState, useEffect } from "react";
import axios from "axios";
import { TableContainer, Table, Thead, Tr, Th, Td, Tbody, Button, Input, Select } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import CreateScheduleModal from "./Create";
import MyAlertDialog from "../../components/commom_component/alerts/AlertDialog";

const SchedulePage = () => {
    const [schedules, setSchedules] = useState([]);
    const [theaters, setTheater] = useState([]);
    const [rooms, setRoom] = useState([])
    const [movies, setMovies] = useState([])
    const [selectedStartDate, setSelectedStartDate] = useState();
    const [selectedEndDate, setSelectedEndDate] = useState();
    const [selectedMovie, setSelectedMovie] = useState();
    const [selectedRoom, setSelectedRoom] = useState();
    const [selectedTheater, setSelectedTheater] = useState();
    const [selectedTime, setSelectedTime] = useState();
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isWarningAlertOpen, setIsWarningAlertOpen] = useState(false);
    const [scheduleToDisable, setScheduleToDisable] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchTheaters = async () => {
        try {
            const response = await axios.get("http://localhost:8000/TheaterService");
            setTheater(response.data);
            fetchRooms();
        }
        catch (error) {
            console.error("Error fetching theaters:", error);
        }
    }
    const fetchRooms = async (theaterId) => {
        try {
            const response = await axios.get(`http://localhost:8000/RoomService/GetRoomByTheater/${theaterId}`);
            setRoom(response.data);
        }
        catch (error) {
            console.error("Error fetching rooms:", error);
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
    const fetchSchedules = async () => {
        try {
            const response = await axios.get("http://localhost:8000/ScheduleService/GetAllBasicSchedule", {
                headers: {
                    Site: "admin",
                },
            });
            setSchedules(response.data);
        } catch (error) {
            console.error("Error fetching schedules:", error);
        }
    };

    const deleteSchedule = async (movieId, roomId, date, time) => {
        try {
            const url = `http://localhost:8000/ScheduleService/DeleteSchedule?movieId=${encodeURIComponent(movieId)}&roomId=${encodeURIComponent(roomId)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`;
    
            await axios.delete(url);
    
            fetchSchedules();
        } catch (error) {
            console.error("Error deleting schedule:", error);
        }
    };
    
    const checkIsExistInvoiceInSchedule = async (movieId, roomId, date, time) => {
        try {
            const response = axios.post(`http://localhost:8000/ScheduleService/DeleteSchedule?movieId=${encodeURIComponent(movieId)}&roomId=${encodeURIComponent(roomId)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`);
            return response.data;
        } catch (error) {
            console.error("Error checking invoice in schedule:", error);
        }
    }
    const handleChooseSelectedTheater = (theaterId) => {
        setSelectedTheater(theaterId);
        fetchRooms(theaterId);
    }

    useEffect(() => {
        // Calculate start (Monday) and end (Sunday) dates of the current week
        const today = new Date();
        const dayOfWeek = today.getDay();
        const start = new Date(today);
        const end = new Date(today);

        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust if today is Sunday (dayOfWeek = 0)
        const diffToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

        start.setDate(today.getDate() + diffToMonday);
        end.setDate(today.getDate() + diffToSunday);

        // Set initial state values
        setSelectedStartDate(start.toISOString().split('T')[0]); // Convert to yyyy-mm-dd format
        setSelectedEndDate(end.toISOString().split('T')[0]); // Convert to yyyy-mm-dd format

        fetchSchedules();
        fetchMovie();
        fetchTheaters();
    }, []);

    const handleCreateOpen = () => setCreateOpen(true);
    const handleCreateClose = () => setCreateOpen(false);

    const handleAlertOpen = (schedule) => {
        setScheduleToDisable(schedule);
        setIsAlertOpen(true);
    };

    const handleAlertClose = () => {
        setIsAlertOpen(false);
        setScheduleToDisable(null);
    };

    const handleWarningAlertClose = () => {
        setIsWarningAlertOpen(false);
    };

    const handleConfirmDisable = async () => {
        if (scheduleToDisable) {
            const { movieId, roomId, date, time } = scheduleToDisable;
            const hasInvoice = await checkIsExistInvoiceInSchedule(
                movieId,
                roomId,
                date,
                time
            );
            
            if (hasInvoice) {
                setIsWarningAlertOpen(true); 
            } else {
                await deleteSchedule(movieId, roomId, date, time);
            }
            handleAlertClose();
        }
    };

    const filteredSchedules = schedules
        .filter((schedule) => !selectedMovie || schedule.movieId == selectedMovie)
        .filter((schedule) => !selectedRoom || schedule.roomId == selectedRoom)
        .filter((schedule) => !selectedTheater || schedule.theaterId == selectedTheater)
        .filter((schedule) => !selectedStartDate || schedule.date >= selectedStartDate)
        .filter((schedule) => !selectedEndDate || schedule.date <= selectedEndDate)
        .filter((schedule) => !selectedTime || schedule.time == selectedTime)
        .filter((schedule) => !searchQuery || schedule.movieName.toLowerCase().includes(searchQuery.toLowerCase()));

    console.log(schedules);
    console.log(filteredSchedules);
    return (
        <div className="mx-5 my-5">
            <h1 className="ml-5 mb-5 font-bold text-3xl">Quản lý lịch chiếu</h1>
            <div className="flex justify-between mb-5">
                <Button
                    colorScheme="blue"
                    className="ml-5"
                    onClick={handleCreateOpen}
                    _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                    }}
                >
                    Tạo mới
                </Button>
                <Input
                    placeholder="Tìm kiếm phim"
                    style={{ width: "25rem" }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex flex-row">
                <div className="">
                    <label className="text-gray-600 text-[.9rem]">Rạp chiếu</label>
                    <Select
                        style={{ width: "270px" }}
                        placeholder="Chọn rạp chiếu"
                        value={selectedTheater}
                        onChange={(e) => handleChooseSelectedTheater(e.target.value)}
                    >
                        {theaters.map((theater, index) => (
                            <option key={index} value={theater.id}>{theater.name}</option>
                        ))}
                    </Select>

                </div>
                <div className="ml-5">
                    <label className="text-gray-600 text-[.9rem]">Phòng chiếu</label>
                    <Select
                        style={{ width: "270px" }}
                        placeholder="Chọn phòng chiếu"
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}>
                        {rooms.map((room, index) => (
                            <option key={index} value={room.id}>{room.name}</option>
                        ))}
                    </Select>
                </div>
                <div className="ml-5">
                    <label className="text-gray-600 text-[.9rem]">Phim chiếu</label>
                    <Select style={{ width: "270px" }}
                        placeholder="Chọn phim chiếu"
                        value={selectedMovie}
                        onChange={(e) => setSelectedMovie(e.target.value)}>
                        {movies.map((movie, index) => (
                            <option key={index} value={movie.id}>{movie.title}</option>
                        ))}
                    </Select>
                </div>
            </div>
            <div className="flex flex-row">
                <div >
                    <label className="text-gray-600 text-[.9rem]">Ngày bắt đầu</label>
                    <Input type="date" value={selectedStartDate}
                        onChange={(e) => setSelectedStartDate(e.target.value)} />
                </div>
                <div className="ml-5">
                    <label className="text-gray-600 text-[.9rem]">Ngày kết thúc</label>
                    <Input type="date" value={selectedEndDate}
                        onChange={(e) => setSelectedEndDate(e.target.value)} />
                </div>
                <div className="ml-5">
                    <label className="text-gray-600 text-[.9rem]">Giờ chiếu</label>
                    <Input type="time" step="1" amPmAriaLabel="false" lang="en-GB" value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)} />
                </div>
            </div>
            <TableContainer>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Rạp chiếu</Th>
                            <Th>Phòng chiếu</Th>
                            <Th>Ngày chiếu</Th>
                            <Th>Phim chiếu</Th>
                            <Th>Giờ chiếu</Th>
                            <Th>Trạng thái</Th>
                            <Th>Thao tác</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredSchedules.map((schedule, index) => (
                            <Tr key={index}>
                                <Td>{schedule.theaterName}</Td>
                                <Td>{schedule.roomName}</Td>
                                <Td>{schedule.date}</Td>
                                <Td>{schedule.movieName}</Td>
                                <Td>{schedule.time}</Td>
                                <Td>Active</Td>
                                <Td>
                                    <Button
                                        leftIcon={<DeleteIcon />}
                                        colorScheme="red"
                                        variant="solid"
                                        mr={2}
                                        onClick={() => handleAlertOpen(schedule)}
                                    >
                                        Xóa
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <CreateScheduleModal isOpen={isCreateOpen} onClose={handleCreateClose} fetchSchedule={fetchSchedules} />
            <MyAlertDialog
                title="Cảnh báo"
                content={`Bạn có chắc chắn muốn xóa lịch này không? Lưu ý: Tính năng chỉ cho phép xóa lịch chưa có doanh thu chưa được cập nhật, hãy cân nhắc khi xóa lịch này!`}
                isOpen={isAlertOpen}
                onClose={handleAlertClose}
                onConfirm={handleConfirmDisable}
            />
            <MyAlertDialog
                isOpen={isWarningAlertOpen}
                onClose={handleWarningAlertClose}
                title="Cảnh báo"
                content={`Bạn không thể xóa lịch này, vì lịch này đã có doanh thu!`}
                onConfirm={handleWarningAlertClose}
            />
        </div>
    );
};

export default SchedulePage;
