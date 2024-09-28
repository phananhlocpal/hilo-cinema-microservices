import axios from 'axios';

export const FETCH_SCHEDULE_REQUEST = 'FETCH_SCHEDULE_REQUEST';
export const FETCH_SCHEDULE_SUCCESS = 'FETCH_SCHEDULE_SUCCESS';
export const FETCH_SCHEDULE_FAILURE = 'FETCH_SCHEDULE_FAILURE';

export const fetchSchedule = (url) => async (dispatch) => {
    dispatch({ type: FETCH_SCHEDULE_REQUEST });
    try {
        const response = await axios.get(`http://localhost:8000/ScheduleService/movieUrl/${url}`);
        const result = response.data;

        console.log(result);

        const filteredResult = filterFutureSchedules(result)

        console.log(filteredResult);

        dispatch({ type: FETCH_SCHEDULE_SUCCESS, payload: filteredResult });
    } catch (error) {
        dispatch({ type: FETCH_SCHEDULE_FAILURE, error: error.message + " - Lỗi nè" });
    }
};

// Helper function to filter schedules after the current date
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
