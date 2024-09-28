import PropTypes from 'prop-types';

const MovieChooseDateComponent = ({ schedule = [], selectedDate, onDateChange }) => {
    console.log(schedule);

    return (
        <div>
            <div className="movie__filter grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-5 xl:grid-cols-12 items-center">
                <div className="filter__date order-2 sm:order-1 sm:col-span-3 md:col-span-3 xl:col-span-7 lg:col-span-3 px-7 mt-6 md:mt-0">
                    <div className="slick-slider slick-initialized flex" dir="ltr">
                        <div className="slick-list mx-2">
                            <div className="flex justify-center items-center">
                                    {schedule.map((detailSchedule, index) => {
                                        const { dayOfWeek, formattedDate } = formatDate(detailSchedule.date);
                                        return (
                                            <div key={index} data-index={index} className="slick-slide slick-active" tabIndex="-1" aria-hidden="false" style={{ outline: 'none' }}>
                                                <div>
                                                    <div className="mx-2" tabIndex="-1" style={{ width: '100%', display: 'inline-block' }}>
                                                        <a
                                                            className={`flex flex-wrap items-center capitalize text-center text-sm w-[80px] h-[65px] rounded-[5px] py-2 cursor-pointer ${selectedDate === detailSchedule.date ? 'bg-[#034ea2] text-white' : ''}`}
                                                            onClick={() => onDateChange(detailSchedule.date)}
                                                        >
                                                            <span className="inline-block w-full">{dayOfWeek}</span>
                                                            <span className="inline-block w-full">{formattedDate}</span>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

MovieChooseDateComponent.propTypes = {
    schedule: PropTypes.arrayOf(
        PropTypes.shape({
            date: PropTypes.string.isRequired,
            theater: PropTypes.shape({
                name: PropTypes.string.isRequired
            }).isRequired,
            times: PropTypes.arrayOf(PropTypes.string).isRequired
        })
    ).isRequired,
    selectedDate: PropTypes.string.isRequired,
    onDateChange: PropTypes.func.isRequired,
};

const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    const dayOfWeek = isToday ? 'Hôm nay' : daysOfWeek[date.getDay()];
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;

    return { dayOfWeek, formattedDate };
};


export default MovieChooseDateComponent;


 {/* <div className="filter__location order-1 sm:order-2 sm:col-span-3 md:col-span-3 xl:col-span-5 lg:col-span-2 grid grid-cols-2 ml-2 gap-1">
                    <div className="col-span-1">
                        <div>
                            <div aria-label="Dropdown select" aria-expanded="false" tabIndex="0" direction="ltr" className="react-dropdown-select text-sm css-y6f7bg e1gzf2xs0" color="#0074D9">
                                <div className="react-dropdown-select-content react-dropdown-select-type-single css-1m5113o e1gn6jc30">
                                    <span>Toàn quốc</span>
                                    <input tabIndex="-1" className="react-dropdown-select-input css-1q95dnp e11wid6y0" readOnly placeholder="" value="" />
                                </div>
                                <div tabIndex="-1" className="react-dropdown-select-dropdown-handle css-ago8sv e1vudypg0" rotate="1" color="#0074D9">
                                    <svg fill="currentColor" viewBox="0 0 40 40">
                                        <path d="M31 26.4q0 .3-.2.5l-1.1 1.2q-.3.2-.6.2t-.5-.2l-8.7-8.8-8.8 8.8q-.2.2-.5.2t-.5-.2l-1.2-1.2q-.2-.2-.2-.5t.2-.5l10.4-10.4q.3-.2.6-.2t.5.2l10.4 10.4q.2.2.2.5z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div>
                            <div aria-label="Dropdown select" aria-expanded="false" tabIndex="0" direction="ltr" className="react-dropdown-select text-sm css-y6f7bg e1gzf2xs0" color="#0074D9">
                                <div className="react-dropdown-select-content react-dropdown-select-type-single css-1m5113o e1gn6jc30">
                                    <span>Tất cả rạp</span>
                                    <input tabIndex="-1" className="react-dropdown-select-input css-1q95dnp e11wid6y0" readOnly placeholder="" value="" />
                                </div>
                                <div tabIndex="-1" className="react-dropdown-select-dropdown-handle css-ago8sv e1vudypg0" rotate="1" color="#0074D9">
                                    <svg fill="currentColor" viewBox="0 0 40 40">
                                        <path d="M31 26.4q0 .3-.2.5l-1.1 1.2q-.3.2-.6.2t-.5-.2l-8.7-8.8-8.8 8.8q-.2.2-.5.2t-.5-.2l-1.2-1.2q-.2-.2-.2-.5t.2-.5l10.4-10.4q.3-.2.6-.2t.5.2l10.4 10.4q.2.2.2.5z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}