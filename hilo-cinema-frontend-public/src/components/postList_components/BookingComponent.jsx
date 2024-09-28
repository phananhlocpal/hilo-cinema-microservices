import PropTypes from 'prop-types';
// import Select from 'react-dropdown-select';

const BookingComponent = (props) => {
    return (
        <div className="card-body flex flex-col gap-3 px-3 py-4 bg-grey-110 rounded-b border border-grey-20">
            <section className="flex items-center flex-1">
                <div className="flex flex-col w-full ">
                    <h1 className="text-5xl font-extrabold text-center lg:text-5xl xl:text-5xl">
                        <span className="text-transparent bg-gradient-to-br bg-clip-text from-teal-500 via-indigo-500 to-sky-500 dark:from-teal-200 dark:via-indigo-300 dark:to-sky-500">
                            Coming
                        </span>

                        <span className="text-transparent bg-gradient-to-tr bg-clip-text from-blue-500 via-pink-500 to-red-500 dark:from-sky-300 dark:via-pink-300 dark:to-red-500">
                            Soon
                        </span>
                    </h1>

                    <p className="max-w-sm mx-auto mt-6 text-sm text-center text-gray-700 dark:text-white md:text-sm">
                        Tính năng đang trong quá trình phát triển. Quý khách vui lòng thử lại sau!
                    </p>
                </div>
            </section>
            {/* <Select
                options={props.options}
                labelField="name"
                valueField="id"
                onChange={(values) => this.setValues(values)}
                searchable={false} 
                placeholder="Chọn phim"
                
            />
            <Select
                options={props.options}
                labelField="name"
                valueField="id"
                onChange={(values) => this.setValues(values)}
                searchable={false} 
                placeholder="Chọn rạp"
                
            />
            <Select
                options={props.options}
                labelField="name"
                valueField="id"
                onChange={(values) => this.setValues(values)}
                searchable={false} 
                placeholder="Chọn ngày"
                
            /> */}
        </div>
    );
};

BookingComponent.propTypes = {
    options:PropTypes.array,
};

export default BookingComponent;