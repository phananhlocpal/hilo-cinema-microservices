import LabelLineComponent from "../common_components/LabelLineComponent";

const MovieOverviewComponent = ({movie}) => {
    console.log(movie.imgSmall);
    return (
        <div className="movie__info relative md:grid hidden grid-cols-3 md:gap-5 gap-3 lg:items-end ">
            <div className="movie__thumbnail lg:-translate-y-20 md:-translate-y-16 -translate-y-0 col-span-1 drop-shadow-2xl z-[500]">
                <img alt="Những Mảnh Ghép Cảm Xúc 2" loading="lazy" width="220" height="280" decoding="async" data-nimg="1" className="border-2 rounded border-white lg:w-[320px] lg:h-[400px] w-full h-full object-fill object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" src={`data:image/jpeg;base64,${movie.imgSmall}`}/>
            </div>
            <div className="col-span-2 lg:-translate-y-20 flex flex-col justify-end md:-translate-y-16 -translate-y-0">
                <div className="item__title flex items-center">
                    <h1 className="text-[20px] md:text-[24px] lg:text-[28px] font-bold text-black-10 mr-4">
                        {movie.title}
                    </h1>
                </div>
                <div className="flex items-center">
                    <div className="text-sm flex items-center font-semibold not-italic">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block align-baseline mr-1"><path d="M7 0C3.13306 0 0 3.13306 0 7C0 10.8669 3.13306 14 7 14C10.8669 14 14 10.8669 14 7C14 3.13306 10.8669 0 7 0ZM7 12.6452C3.88105 12.6452 1.35484 10.119 1.35484 7C1.35484 3.88105 3.88105 1.35484 7 1.35484C10.119 1.35484 12.6452 3.88105 12.6452 7C12.6452 10.119 10.119 12.6452 7 12.6452ZM8.74435 9.69839L6.34798 7.95685C6.26048 7.89193 6.20968 7.79032 6.20968 7.68306V3.04839C6.20968 2.8621 6.3621 2.70968 6.54839 2.70968H7.45161C7.6379 2.70968 7.79032 2.8621 7.79032 3.04839V7.04798L9.67581 8.41976C9.82823 8.52984 9.85927 8.74153 9.74919 8.89395L9.21855 9.625C9.10847 9.7746 8.89677 9.80847 8.74435 9.69839Z" fill="#F58020"></path></svg>
                        <span>{movie.duration}</span>
                    </div>
                    <div className="text-sm ml-4 flex items-center font-semibold not-italic">
                        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" className="inline-block align-baseline mr-1"><path d="M10.7143 1.75H9.42857V0.328125C9.42857 0.147656 9.28393 0 9.10714 0H8.03571C7.85893 0 7.71429 0.147656 7.71429 0.328125V1.75H4.28571V0.328125C4.28571 0.147656 4.14107 0 3.96429 0H2.89286C2.71607 0 2.57143 0.147656 2.57143 0.328125V1.75H1.28571C0.575893 1.75 0 2.33789 0 3.0625V12.6875C0 13.4121 0.575893 14 1.28571 14H10.7143C11.4241 14 12 13.4121 12 12.6875V3.0625C12 2.33789 11.4241 1.75 10.7143 1.75ZM10.5536 12.6875H1.44643C1.35804 12.6875 1.28571 12.6137 1.28571 12.5234V4.375H10.7143V12.5234C10.7143 12.6137 10.642 12.6875 10.5536 12.6875Z" fill="#F58020"></path></svg>
                        <span>{movie.releasedDate}</span>
                    </div>
                </div>
                <div className="mt-2">
                    <a className="text-[20px] hover:text-primary transition duration-500 ease-in-out cursor-pointer">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" className="svg-inline--fa fa-star text-primary mr-1 hover:text-primary transition duration-500 ease-in-out" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg>
                        <span className="inline-block mr-1">{movie.rate}</span>
                        <span className="inline-block text-sm text-grey-40 hover:text-primary transition duration-500 ease-in-out">
                            (295 votes)
                        </span>
                    </a>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-nowrap  text-sm">
                        <span className="inline-block h-8 py-[6px] text-grey-40">Quốc gia:</span>
                        <span className="inline-block h-8 ml-4 py-[6px] capitalize not-italic">{movie.country}</span>
                    </div>
                    <div className="flex flex-nowrap items-center  text-sm">
                        <span className="inline-block h-8 py-[6px] text-grey-40 flex-0">Nhà sản xuất:
                        </span>
                        <ul className="ml-2 flex flex-wrap gap-1 flex-1">
                            <li className="text-sm cursor-pointer hover:text-primary transition duration-500 ease-in-out">
                                <span className="mr-[1px]">PIXAR,</span>
                            </li>
                            <li className="text-sm cursor-pointer hover:text-primary transition duration-500 ease-in-out">
                                <span className="mr-[1px]">Walt Disney Pictures</span>
                            </li>
                        </ul>
                    </div>
                    <LabelLineComponent labeLineTitle="Thể loại" labelList={["Kịch", "Hài hước"]} />
                    <LabelLineComponent labeLineTitle="Đạo diễn" labelList={[movie.director]} />
                    <LabelLineComponent labeLineTitle="Diễn viên" labelList={["Amy Poehler", "Phyllis Smith", "Lewis Black"]} />
                </div>
            </div>
        </div>

    );
};

export default MovieOverviewComponent;