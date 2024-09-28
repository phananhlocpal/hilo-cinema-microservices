import { useState } from "react";
import { Modal } from "react-responsive-modal";
import 'react-responsive-modal/styles.css';
import { IconButton, InputAdornment, TextField, Button } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { isLogIn, setAuthData } from "../redux/actions/authAction";
import PropTypes from "prop-types";
import { useToast } from '@chakra-ui/react'

const SignIn = ({ isOpen, onClose }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const toast = useToast();

    
    const handlePasswordVisibilityToggle = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:8000/CustomerAuthen', {
                email,
                password,
                site: 'public'
            });

            if (response.data.account === null) {
                console.log("Mật khẩu hoặc tài khoản sai");
                toast({
                    title: 'Mật khẩu hoặc tài khoản sai',
                    description: 'Bạn vui lòng kiểm tra lại tài khoản và mật khẩu',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-center',
                  });
                return;
            }

            if (response.data.account) {
                const { account, jwtToken } = response.data;
                
                console.log(account);
                dispatch(setAuthData(account, jwtToken));
                dispatch(isLogIn(true));

                localStorage.setItem('jwtToken', jwtToken);

                onClose();
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast({
                title: 'Có lỗi xảy ra!',
                description: 'Vui lòng thử lại sau.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-right',
              });
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            center
            styles={{
                modal: {
                    width: '400px', // Set your desired width here
                    maxWidth: '90%', // Ensures the modal is responsive
                    padding: '20px', // Adds some padding
                    borderRadius: '10px', // Rounded corners
                },
                overlay: {
                    background: 'rgba(0, 0, 0, 0.5)', // Overlay background with some transparency
                },
            }}
        >
            <div className="bg-white rounded-lg p-5">
                <div className="text-center mb-4">
                    <img
                        src="https://www.galaxycine.vn/_next/static/media/icon-login.fbbf1b2d.svg"
                        alt="Icon Login"
                        className="mx-auto mb-4 w-48"
                    />
                    <h5 className="text-lg font-bold capitalize">Đăng nhập tài khoản</h5>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            inputProps={{ pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$" }} 
                        />
                    </div>
                    <div className="mb-4">
                        <TextField
                            fullWidth
                            label="Mật khẩu"
                            variant="outlined"
                            type={passwordVisible ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handlePasswordVisibilityToggle}
                                            edge="end"
                                        >
                                            {passwordVisible ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ py: 2, mt: 2 }}
                    >
                        Đăng nhập
                    </Button>
                    <div className="text-center text-sm mt-4">
                        <a href="#" className="text-blue-500 hover:underline">
                            Quên mật khẩu?
                        </a>
                    </div>
                </form>
                <div className="text-center text-sm mt-6">
                    <span>Bạn chưa có tài khoản? </span>
                    <a href="https://www.galaxycine.vn/dang-ky/" className="text-blue-500 hover:underline">
                        Đăng ký
                    </a>
                </div>
            </div>
        </Modal>
    );
};

SignIn.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default SignIn;
