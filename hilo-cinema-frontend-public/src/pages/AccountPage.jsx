import { TextField, Button, CircularProgress } from "@mui/material";
import InfoTab from "./account_tabs/InfoTab";
import { useSelector, useDispatch } from 'react-redux';
import { useState } from "react";
import { updateAccount } from "../redux/actions/authAction";
import axios from "axios";
import CheckTokenRedirectHome from "../helpers/CheckTokenRedirectHome";
import { Modal } from "react-responsive-modal";
import 'react-responsive-modal/styles.css';
import CommingSoonTab from "./account_tabs/CommingSoonTab";
import { useToast } from "@chakra-ui/react";
import PropTypes from "prop-types";
import HistoryTab from "./account_tabs/HistoryTab";
import ava_male from '../assets/images/ava/ava_male.png'
import ava_female from '../assets/images/ava/ava_female.png';

const AccountPage = () => {
    CheckTokenRedirectHome();
    const [isNameModalOpen, setNameModalOpen] = useState(false);
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [isBirthdayModalOpen, setBirthdayModalOpen] = useState(false);

    const [currentTab, setCurrentTab] = useState('InfoTab');
    const [loading, setLoading] = useState(false);
    const [setError] = useState('');

    const { account } = useSelector((state) => state.auth);

    const [newAccountName, setNewAccountName] = useState(account.name)
    const [newBirthday, setNewBirthday] = useState(account.birthdate)
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const dispatch = useDispatch();
    const toast = useToast();

    const closeModal = () => {
        setNameModalOpen(false);
        setPasswordModalOpen(false);
        setBirthdayModalOpen(false);
    };

    const handleUpdateAccount = async () => {
        setLoading(true);
        try {
            var updatedData = account;
            const token = localStorage.getItem('jwtToken');
            if (newAccountName != account.name)
                updatedData.name = newAccountName;
            if (newBirthday != account.birthdate)
                updatedData.birthdate = newBirthday;
            if (newPassword) {
                updatedData.password = newPassword;
            } else {
                updatedData.password = null;
            }   

            console.log(updatedData);
            const response = await axios.put(`http://localhost:8000/CustomerService/${account.id}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                dispatch(updateAccount(response.data)); 
                toast({
                    title: 'Cập nhật tài khoản thành công!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-right',
                });
                closeModal(); 
            }
        } catch (error) {
            setError("Error updating account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            toast({
                title: 'Vui lòng nhập đầy đủ thông tin!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-right',
            });
            return;
        }
        if (newPassword !== confirmNewPassword) {
            toast({
                title: 'Mật khẩu xác nhận không trùng khớp với mật khẩu mới!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-right',
            });
            return;
        }
    
        try {
            const jwtToken = localStorage.getItem('jwtToken');

            const response = await fetch('http://localhost:8000/CustomerService/verify-password', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}` 
                },
                body: JSON.stringify({ 
                    "email": account.email,
                    "password": currentPassword 
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    title: `${errorData} | Lỗi xác thực mật khẩu hiện tại!`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-right',
                });
                return;
            }
    
            await handleUpdateAccount();
    
            toast({
                title: 'Cập nhật mật khẩu thành công!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom-right',
            });
            closeModal();
        } catch (error) {
            toast({
                title: 'Đã xảy ra lỗi khi cập nhật mật khẩu!',
                description: 'Vui lòng thử lại sau!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-right',
            });
        }
    
        handleUpdateAccount();
        closeModal(); 
    };

    return (
        <div className="bg-white-10">
            <div className="grid-cols-1 md:grid-cols-4 lg:grid-cols-3 my-0 mx-auto screen1390:max-w-screen-xl xl:max-w-screen-screen1200 lg:max-w-5xl md:py-10 py-5 md:gap-[30px] xl:gap-16 px-4 md:px-[45px] xl:px-0 xl:grid">
                <div className="md:col-span-2 lg:col-span-1">
                    <div className="bg-white px-6 md:p-4 xl:px-6 xl:py-4  xl:shadow-2xl rounded mb-8">
                        <NameComponent account={account} />
                        <div className="info__money__rating py-6 xl:border-b border-[#ECECEC]">
                            <div className="flex justify-between items-center ">
                                <p className="md:text-base xl:text-lg font-bold not-italic relative">Tổng chi tiêu 2024</p>
                                <span className="md:text-base xl:text-lg font-bold not-italic text-[#F58020]">0&nbsp;₫</span>
                            </div>
                        </div>
                        <InfoSupport />
                    </div>
                </div>
                <div className="md:col-span-2 lg:col-span-2 col-span-2">
                    <AccountNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
                    {currentTab=="InfoTab"? (
                        <InfoTab
                        account={account}
                        currentName={newAccountName}
                        currentBirthday={newBirthday}
                        setNameModalOpen={setNameModalOpen}
                        setPasswordModalOpen={setPasswordModalOpen}
                        setBirthdayModalOpen={setBirthdayModalOpen}
                    />
                    ) : currentTab=="HistoryTab"? (
                        <HistoryTab />
                    ) : (
                        <CommingSoonTab/>
                    )}
                    
                </div>
            </div>
            {/* Modal change Fullname */}
            <Modal open={isNameModalOpen} onClose={closeModal} center 
            styles={{
                modal: {
                    width: '400px',
                    maxWidth: '90%',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                },
                overlay: {
                    background: 'rgba(0, 0, 0, 0.4)',
                },
            }}>
                <div className="bg-white rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Change Full Name</h2>
                    <TextField
                        label="Full Name"
                        fullWidth
                        variant="outlined"
                        value={newAccountName}
                        onChange={(e) => setNewAccountName(e.target.value)}
                        className="mb-4"
                    />
                    <Button
                        style={{marginTop: "10px"}}
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateAccount()}
                        fullWidth
                        disabled={loading}
                    >
                         {loading ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                </div>
            </Modal>

            {/* Change Password */}
            <Modal open={isPasswordModalOpen} onClose={closeModal} center 
            styles={{
                modal: {
                    width: '400px',
                    maxWidth: '90%',
                    padding: '20px',
                    borderRadius: '10px',
                },
                overlay: {
                    background: 'rgba(0, 0, 0, 0.5)',
                },
            }}>
                <div className="bg-white rounded-lg p-5">
                    <h2>Change Password</h2>
                    <TextField
                        type="password"
                        label="Current Password"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <TextField
                        type="password"
                        label="New Password"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        type="password"
                        label="Confirm New Password"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <Button onClick={handleChangePassword} color="primary" variant="contained" fullWidth>
                        Save
                    </Button>
                </div>
            </Modal>

            {/* Change Birthday */}
            <Modal open={isBirthdayModalOpen} onClose={closeModal} center 
            styles={{
                modal: {
                    width: '400px',
                    maxWidth: '90%',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                },
                overlay: {
                    background: 'rgba(0, 0, 0, 0.4)',
                },
            }}>
                <div className="bg-white rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Change Birthday</h2>
                    <TextField
                        type="date"
                        label="Birthday"
                        fullWidth
                        variant="outlined"
                        value={newBirthday}
                        onChange={(e) => setNewBirthday(e.target.value)}
                        className="mb-4"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateAccount()}
                        fullWidth
                    >
                        Save
                    </Button>
                </div>
            </Modal>
        </div>
    );
};


const AccountNav = ({currentTab, setCurrentTab}) => {
    return (
        <div className="account-nav relative">
            <ul className="flex flex-nowrap mb-0 list-none flex-row whitespace-nowrap" role="tablist">
                <li className="px-2 pb-2 flex-auto text-center transition-all duration-300 cursor-pointer relative border-b border-grey-80">
                    <a className={`text-base font-bold not-italic block leading-normal transition-all duration-300 capitalize ${currentTab==="HistoryTab"? "text-blue-10" : "text-black-10 opacity-50"}`} href="#transaction" onClick={()=> setCurrentTab("HistoryTab")}>Lịch sử giao dịch</a>
                    {
                        currentTab==="HistoryTab"? (
                            <div className="w-8 h-[2px] bg-blue-10 duration-300 transition-all ease-in-out absolute bottom-0 left-[50%] -translate-x-2/4"></div>
                        ): (null)
                    }
                </li>
                <li className="px-2 pb-2 flex-auto text-center transition-all duration-300 cursor-pointer relative border-b border-grey-80">
                    <a className={`text-base font-bold not-italic block leading-normal transition-all duration-300 capitalize ${currentTab==="InfoTab"? "text-blue-10" : "text-black-10 opacity-50"}`} href="#profile" onClick={()=> setCurrentTab("InfoTab")}>Thông tin cá nhân</a>
                    {
                        currentTab==="InfoTab"? (
                            <div className="w-8 h-[2px] bg-blue-10 duration-300 transition-all ease-in-out absolute bottom-0 left-[50%] -translate-x-2/4"></div>
                        ): (null)
                    }
                </li>
                <li className="px-2 pb-2 flex-auto text-center transition-all duration-300 cursor-pointer relative border-b border-grey-80">
                    <a className={`text-base font-bold not-italic block leading-normal transition-all duration-300 capitalize ${currentTab==="NotificationTab"? "text-blue-10" : "text-black-10 opacity-50"}`} href="#notification" onClick={()=> setCurrentTab("NotificationTab")}>Thông báo</a>
                    {
                        currentTab==="NotificationTab"? (
                            <div className="w-8 h-[2px] bg-blue-10 duration-300 transition-all ease-in-out absolute bottom-0 left-[50%] -translate-x-2/4"></div>
                        ): (null)
                    }
                </li>
                <li className="px-2 pb-2 flex-auto text-center transition-all duration-300 cursor-pointer relative border-b border-grey-80">
                    <a className={`text-base font-bold not-italic block leading-normal transition-all duration-300 capitalize ${currentTab==="GiftTab"? "text-blue-10" : "text-black-10 opacity-50"}`} href="#reward" onClick={()=> setCurrentTab("GiftTab")}>Quà tặng</a>
                    {
                        currentTab==="GiftTab"? (
                            <div className="w-8 h-[2px] bg-blue-10 duration-300 transition-all ease-in-out absolute bottom-0 left-[50%] -translate-x-2/4"></div>
                        ): (null)
                    }
                </li>
                <li className="px-2 pb-2 flex-auto text-center transition-all duration-300 cursor-pointer relative border-b border-grey-80">
                    <a className={`text-base font-bold not-italic block leading-normal transition-all duration-300 capitalize ${currentTab==="PolicyTab"? "text-blue-10" : "text-black-10 opacity-50"}`} href="#policy" onClick={()=> setCurrentTab("PolicyTab")}>Chính sách</a>
                    {
                        currentTab==="PolicyTab"? (
                            <div className="w-8 h-[2px] bg-blue-10 duration-300 transition-all ease-in-out absolute bottom-0 left-[50%] -translate-x-2/4"></div>
                        ): (null)
                    }
                </li>
            </ul>
        </div>
    );
}

AccountNav.propTypes = {
    currentTab: PropTypes.string.isRequired,
    setCurrentTab: PropTypes.func.isRequired,
}

const NameComponent = ({account}) => {
    return (
        <div className="pt-4 pb-6 xl:border-b border-[#ECECEC] flex justify-center items-center ">
            <div className="flex items-center">
                <div className="w-[72px] h-[72px] leading-[62px] text-center rounded-full bg-[#D0D0D0] border-4 border-solid border-[#E9E9E2]">
                    <img alt="Camera" loading="lazy" decoding="async" data-nimg="1" className="inline-block rounded-full w-full h-full object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" src={account.gender === "Male" ? ava_male : ava_female} style={{ color: "transparent" }} />
                </div>
                <div className="flex flex-col flex-auto">
                    <div className="flex items-start gap-[6px]">
                        <p className="text-[18px] font-bold not-italic leading-[1.25rem] ml-3">{account.name}
                            <span className="block text-xs font-light not-italic"></span>
                        </p>
                        <img alt="Logo Star Mini" loading="lazy" width="20" height="30" decoding="async" data-nimg="1" className="inline-block w-[20px] h-[30px]" src="https://cdn.galaxycine.vn/media/2020/5/15/s_1589511977688.png" style={{ color: "transparent" }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

NameComponent.propTypes = {
    account: PropTypes.object,
}

const InfoSupport = () => {
    return (
        <div className="info__support border-0">
            <ul>
                <li className="py-4">
                    <a className="cursor-pointer flex justify-between items-center" href="tel:19002224">
                        <h3 className="text-sm font-bold not-italic text-[#034EA2]">
                            <strong className="text-[#333333]">HOTLINE hỗ trợ:</strong> 19002224 (9:00 - 22:00)
                        </h3>
                        <span>
                            <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M4.58579 6L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893C0.683418 -0.0976305 1.31658 -0.0976305 1.70711 0.292893L6.70711 5.29289C7.09763 5.68342 7.09763 6.31658 6.70711 6.70711L1.70711 11.7071C1.31658 12.0976 0.683418 12.0976 0.292893 11.7071C-0.0976311 11.3166 -0.0976311 10.6834 0.292893 10.2929L4.58579 6Z" fill="#777777"></path></svg>
                        </span>
                    </a>
                </li>
                <li className="py-4 border-y border-[#ECECEC]"><a className="cursor-pointer flex justify-between items-center" href="mailto:hotro@galaxystudio.vn">
                    <h3 className="text-sm font-bold not-italic text-[#034EA2]"><strong className="text-[#333333]">Email:</strong> hotro@galaxystudio.vn</h3>
                    <span>
                        <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M4.58579 6L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893C0.683418 -0.0976305 1.31658 -0.0976305 1.70711 0.292893L6.70711 5.29289C7.09763 5.68342 7.09763 6.31658 6.70711 6.70711L1.70711 11.7071C1.31658 12.0976 0.683418 12.0976 0.292893 11.7071C-0.0976311 11.3166 -0.0976311 10.6834 0.292893 10.2929L4.58579 6Z" fill="#777777"></path></svg>
                    </span>
                </a>
                </li>
                <li className="py-4">
                    <a className="cursor-pointer flex justify-between items-center" href="/hoi-dap/">
                        <h3 className="text-sm font-bold not-italic">Câu hỏi thường gặp</h3>
                        <span>
                            <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M4.58579 6L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893C0.683418 -0.0976305 1.31658 -0.0976305 1.70711 0.292893L6.70711 5.29289C7.09763 5.68342 7.09763 6.31658 6.70711 6.70711L1.70711 11.7071C1.31658 12.0976 0.683418 12.0976 0.292893 11.7071C-0.0976311 11.3166 -0.0976311 10.6834 0.292893 10.2929L4.58579 6Z" fill="#777777"></path></svg>
                        </span>
                    </a>
                </li>
            </ul>
        </div>
    );
}
export default AccountPage;

