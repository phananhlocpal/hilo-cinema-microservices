import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
const CinemaScheduleLine = ({ cinemaData, label, times }) => {
    return (
        <div>
            <label className="text-sm font-semibold text-grey-10 mt-2 w-[150px]">
                {label}
            </label>
            <div className="time__show flex flex-1 flex-row gap-x-3 gap-y-1 flex-wrap">
                {times.map((time, index) => (
                    <Link key={index} to={`/dat-ve/${cinemaData.url}`}>
                        <button className="py-2 md:px-8 px-6 border rounded text-sm font-normal text-black-10 hover:bg-blue-10 active:bg-blue-10 transition-all duration-500 ease-in-out hover:text-white">
                            {time}
                        </button>
                    </Link>
                    
                ))}
            </div>
        </div>
    );
};

CinemaScheduleLine.propTypes = {
    cinemaData: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    times: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CinemaScheduleLine;
