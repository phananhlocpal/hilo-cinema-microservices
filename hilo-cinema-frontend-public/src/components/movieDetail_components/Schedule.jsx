import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchedule } from "../../redux/actions/movieDetail/scheduleAction";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import MovieChooseDateComponent from "./MovieChooseDateComponent";

const Schedule = ({ movie }) => {
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const { movieUrl } = useParams("movieUrl");
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState();

    const fetchScheduleData = async (url) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8000/ScheduleService/movieUrl/${url}`);
            const result = response.data;

            console.log(result);

            const filteredResult = filterFutureSchedules(result)

            console.log(filteredResult);

            setSchedules(filteredResult);
        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setLoading(false);
        }
    };

    const filterFutureSchedules = (data) => {
        const today = new Date();
        return data.schedules.filter(schedule => {
            const scheduleDate = new Date(schedule.date);
            return scheduleDate >= today;
        }).map(schedule => {
            return {
                ...schedule,
                theaterSchedules: schedule.theaterSchedules.map(theaterSchedule => ({
                    ...theaterSchedule,
                    roomSchedules: theaterSchedule.roomSchedules.map(roomSchedule => ({
                        ...roomSchedule,
                        times: roomSchedule.times.filter(time => {
                            const [hours, minutes] = time.split(':').map(Number);
                            const timeDate = new Date(schedule.date);
                            timeDate.setHours(hours, minutes);
                            return timeDate >= today;
                        })
                    }))
                }))
            };
        });
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        fetchScheduleData(movieUrl);
        if (schedules && schedules.length > 0) {
            setSelectedDate(schedules[0].date);
        }
        console.log(schedules);
    }, [movieUrl]);

    if (loading) return (
        <div className="w-full h-[150px] flex justify-center items-center">
            <CircularProgress />
        </div>
    );


    // Lọc lịch trình theo ngày đã chọn
    const filteredSchedules = schedules.filter(scheduleItem => scheduleItem.date === selectedDate);

    const handleTimeClick = (movieId, title, movieUrl, theaterId, theaterName, roomId, roomName, time) => {
        navigate(`/dat-ve/${movieUrl}`, {
            state: {
                movieId,
                title,
                movieUrl,
                theaterName,
                roomName,
                date: selectedDate,
                theaterId,
                roomId,
                time
            }
        });
    };

    return (
        <div>
            <MovieChooseDateComponent
                schedule={schedules}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
            />
            <div className="line"></div>
            {filteredSchedules.length === 0 ? (
                <p>No schedules available for this date.</p>
            ) : (
                filteredSchedules.map((scheduleItem, index) => (
                    <div key={index}>
                        {scheduleItem.theaterSchedules.map((theaterScheduleItem, theaterIndex) => (
                            <div key={theaterIndex} className="showtime__cinema md:py-8 py-4 px-3 odd:bg-white even:bg-[#FDFBFA] even:border-t even:border-b">
                                <h1 className="text-base font-bold mb-4 text-gray-800">
                                    {theaterScheduleItem.theaterName}
                                </h1>
                                <div className="showtime__bundle flex md:flex-row flex-col gap-2 items-start mb-6">
                                    {theaterScheduleItem.roomSchedules.map((roomSchedule, roomIndex) => (
                                        <div key={roomIndex} className="time__show flex flex-1 flex-row gap-x-3 gap-y-1 flex-wrap">
                                            {roomSchedule.times.map((time, timeIndex) => (
                                                <button
                                                    key={timeIndex}
                                                    onClick={() => handleTimeClick(
                                                        movie.id,
                                                        movie.title,
                                                        movie.movieUrl,
                                                        theaterScheduleItem.theaterId,
                                                        theaterScheduleItem.theaterName,
                                                        roomSchedule.roomId,
                                                        roomSchedule.roomName,
                                                        time)}
                                                    className="py-2 md:px-8 px-6 border rounded text-sm font-normal text-black hover:bg-blue-10 active:bg-blue-10  transition-all duration-500 ease-in-out hover:text-white"
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

Schedule.propTypes = {
    movie: PropTypes.object.isRequired
};

export default Schedule;
