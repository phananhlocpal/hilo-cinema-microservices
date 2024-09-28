import ChooseSeatComponent from '../../components/booking_components/ChooseSeatComponent';

const ChooseSeatTab = ({movieId, date, theaterId, roomId, time}) => {
    return (
        <div className="col-span-2 xl:order-first order-last xl:h-full h-full overflow-hidden xl:overflow-auto xl:pb-10 pb-32">
            <div className="bg-white px-6 py-4 rounded md:mb-8 mb-4 w-full">
                <div className="grid md:grid-cols-10 grid-cols-2">
                    <div className="md:col-span-2">
                        <label className="md:text-base text-sm font-semibold inline-block mt-2">
                            Đổi suất chiếu
                        </label>
                    </div>
                    <div className="col-span-8 flex-row gap-4 flex-wrap items-center md:flex hidden">
                        <button className="py-2 px-4 border rounded text-sm font-normal text-black transition-all duration-500 ease-in-out hover:bg-blue-500 active:bg-blue-500 hover:text-white bg-blue-400 ">
                            22:00
                        </button>
                    </div>
                    <div className="md:hidden col-span-1 flex justify-end">
                        <div className="w-[70%]">
                            <div>
                                <div aria-label="Dropdown select" aria-expanded="false" tabIndex="0" direction="ltr" className="react-dropdown-select text-sm css-m42ux0 e1gzf2xs0" color="#0074D9" >
                                    <div className="react-dropdown-select-content react-dropdown-select-type-single css-1m5113o e1gn6jc30">
                                        <span>22:00</span>
                                        <input tabIndex="-1" className="react-dropdown-select-input css-1q95dnp e11wid6y0" readOnly="" placeholder="" value="" />
                                    </div>
                                    <div tabIndex="-1" className="react-dropdown-select-dropdown-handle css-ago8sv e1vudypg0" rotate="1" color="#0074D9">
                                        <svg fill="currentColor" viewBox="0 0 40 40">
                                            <path d="M31 26.4q0 .3-.2.5l-1.1 1.2q-.3.2-.6.2t-.5-.2l-8.7-8.8-8.8 8.8q-.2.2-.5.2t-.5-.2l-1.2-1.2q-.2-.2-.2-.5t.2-.5l10.4-10.4q.3-.2.6-.2t.5.2l10.4 10.4q.2.2.2.5z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ChooseSeatComponent movieId={movieId} date={date} theaterId={theaterId} roomId={roomId} time={time}/>
        </div>
    );
};

export default ChooseSeatTab;
