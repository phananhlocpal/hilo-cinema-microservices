import PropTypes from "prop-types"
import PostTypeHrefHepler from "../../helpers/PostTypeHrefHelper"
import slugify from 'slugify';
const CinemaCornerNBExtended = (props) => {
    return (
        <div>
            <div className="absolute top-[65px] -left-[45px] hidden group-hover:md:block hover:md:block z-[800] drop-shadow-lg">
                <div className="bg-white min-w-[200px] text-center border border-white border-solid rounded">
                    <ul>
                        {props.type === "rap-chieu" ? (
                            props.listItem.map((item, index) => (
                                <li
                                    key={index}
                                    className="text-sm text-black hover:text-[#f26b38] hover:pl-0.5 hover:border-l-4 capitalize hover:border-[#fd841f] hover:bg-[#fb770b1a] transition-all duration-300"
                                >
                                    <a
                                        className="block py-2"
                                        href={`rap-chieu/${item.id}/${slugify(item.theaterName)}`}
                                    >
                                        {item.theaterName}
                                    </a>
                                </li>
                            ))
                        ) : (
                            props.listItem.map((item, index) => (
                                <li
                                    key={index}
                                    className="text-sm text-black hover:text-[#f26b38] hover:pl-0.5 hover:border-l-4 capitalize hover:border-[#fd841f] hover:bg-[#fb770b1a] transition-all duration-300"
                                >
                                    <a
                                        className="block py-2"
                                        href={`blog/${PostTypeHrefHepler(item)}`}
                                    >
                                        {item} 
                                    </a>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

CinemaCornerNBExtended.propTypes = {
    listItem: PropTypes.array,
    type: PropTypes.string,
}
export default CinemaCornerNBExtended;