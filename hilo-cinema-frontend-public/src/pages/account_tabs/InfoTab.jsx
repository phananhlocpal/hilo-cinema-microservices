import PropTypes from "prop-types";

const InfoTab = ({ account, currentName, currentBirthday, setNameModalOpen, setPasswordModalOpen, setBirthdayModalOpen }) => {
    return (
        <div className="px-4 py-4 md:px-0 lg:px-6 md:py-6 bg-white rounded mt-4 xl:shadow-2xl min-h-[350px]">
            <div className="grid md:grid-cols-2 grid-cols-1 md:gap-4 gap-1">
                <div className="col-span-1">
                    <label>Họ và tên</label>
                    <div className="w-full my-1 relative h-auto border inline-flex items-center min-w-0 text-[14px] bg-[#ECECEC] rounded-md transition-all duration-300 opacity-70 cursor-not-allowed">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" className="svg-inline--fa fa-user text-black-30 absolute left-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"></path></svg>
                        <input disabled type="text" className="bg-transparent w-full h-9 px-8 focus:ring-2 focus:outline-blue-500 focus:rounded-md grayscale opacity-70 cursor-not-allowed" value={currentName} />
                        <a onClick={() => setNameModalOpen(true)} className="absolute right-2 cursor-pointer grayscale-0 opacity-100 text-primary z-100 text-[12px] font-bold">
                            <span>Thay đổi</span>
                        </a>
                    </div>
                </div>
                <div className="col-span-1">
                    <label>Ngày sinh</label>
                    <div className="w-full my-1 relative h-auto border inline-flex items-center min-w-0 text-[14px] bg-[#ECECEC] rounded-md transition-all duration-300 opacity-70 cursor-not-allowed">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar" className="svg-inline--fa fa-calendar text-black-30 absolute left-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z"></path></svg>
                        <input disabled type="text" className="bg-transparent w-full h-9 px-8 focus:ring-2 focus:outline-blue-500 focus:rounded-md grayscale opacity-70 cursor-not-allowed" value={currentBirthday} />
                        <a onClick={() => setBirthdayModalOpen(true)} className="absolute right-2 cursor-pointer grayscale-0 opacity-100 text-primary z-100 text-[12px] font-bold">
                            <span>Thay đổi</span>
                        </a>
                    </div>
                </div>
                <div className="col-span-1">
                    <label>Email</label>
                    <div className="w-full my-1 relative h-auto border inline-flex items-center min-w-0 text-[14px] bg-[#ECECEC] rounded-md transition-all duration-300 opacity-70">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="envelope" className="svg-inline--fa fa-envelope text-black-30 absolute left-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"></path></svg>
                        <input disabled type="text" className="bg-transparent w-full h-9 px-8 focus:ring-2 focus:outline-blue-500 focus:rounded-md grayscale opacity-70 cursor-not-allowed" name="email" value={account.email} />
                    </div>
                </div>
                <div className="col-span-1">
                    <label>Số điện thoại</label>
                    <div className="w-full my-1 relative h-auto border inline-flex items-center min-w-0 text-[14px] bg-[#ECECEC] rounded-md transition-all duration-300 grayscale opacity-70 cursor-not-allowed">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="mobile-button" className="svg-inline--fa fa-mobile-button text-black-30 absolute left-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M80 0C44.7 0 16 28.7 16 64V448c0 35.3 28.7 64 64 64H304c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H80zM192 400a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></svg>
                        <input disabled type="text" className="bg-transparent w-full h-9 px-8 focus:ring-2 focus:outline-blue-500 focus:rounded-md grayscale opacity-70 cursor-not-allowed" value={account.phone} />
                    </div>
                </div>
                <div className="col-span-1">
                    <label>Giới tính</label>
                    <div className="gender__wrapper flex flex-wrap justify-start items-center md:mt-8">
                        <div className="flex items-center mr-4 grayscale opacity-70 cursor-not-allowed">
                            <input disabled type="radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 grayscale opacity-70 cursor-not-allowed pointer-events-none" value="Male" checked={account.gender === 'Male' ? true : false} />
                            <label className="ml-2 text-sm font-medium text-gray-900">Nam</label>
                        </div>
                        <div className="flex items-center grayscale opacity-70 cursor-not-allowed">
                            <input disabled type="radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 grayscale opacity-70 cursor-not-allowed pointer-events-none" value="Female" checked={account.gender === 'Female' ? true : false} />
                            <label className="ml-2 text-sm font-medium text-gray-900">Nữ</label>
                        </div>
                    </div>
                </div>
                <div className="col-span-1">
                    <label>Mật khẩu</label>
                    <div className="w-full my-1 relative h-auto border inline-flex items-center min-w-0 text-[14px] bg-[#ECECEC] rounded-md transition-all duration-300 opacity-70 cursor-not-allowed">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="lock" className="svg-inline--fa fa-lock text-black-30 absolute left-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"></path></svg>
                        <input disabled type="password" className="bg-transparent w-full h-9 px-8 focus:ring-2 focus:outline-blue-500 focus:rounded-md grayscale opacity-70 cursor-not-allowed" value="Account Password" />
                        <a onClick={() => setPasswordModalOpen(true)} className="absolute right-2 cursor-pointer grayscale-0 opacity-100 text-primary z-100 text-[12px] font-bold">
                            <span>Thay đổi</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

InfoTab.propTypes = {
    account: PropTypes.object.isRequired,
    currentName: PropTypes.string.isRequired,
    currentBirthday: PropTypes.string.isRequired,
    setNameModalOpen: PropTypes.func.isRequired,
    setPasswordModalOpen: PropTypes.func.isRequired,
    setBirthdayModalOpen: PropTypes.func.isRequired,
}

export default InfoTab;