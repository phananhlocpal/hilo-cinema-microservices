import { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { Button, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, FormHelperText, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { InputAdornment, IconButton } from '@mui/material';
import { useToast } from '@chakra-ui/react'

const SignUp = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dob: null,
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dob: date });
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch('http://localhost:8000/CustomerService/CheckEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(email),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      toast({
        title: 'Lỗi kiểm tra email',
        description: 'Không thể kiểm tra email. Vui lòng thử lại sau.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
      });
      return false;
    }
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
      valid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
      valid = false;
    }

    if (!formData.dob) {
      newErrors.dob = 'Ngày sinh là bắt buộc';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
      valid = false;
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Bạn phải đồng ý với điều khoản dịch vụ';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const emailExists = await checkEmailExists(formData.email);
    if (emailExists) {
      toast({
        title: 'Email đã tồn tại',
        description: 'Email đã tồn tại. Mời bạn nhập email khác!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
      });
      setErrors({ ...errors, email: 'Email đã tồn tại. Mời bạn nhập email khác!' });
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/CustomerService', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          address: null,
          phone: formData.phone,
          gender: formData.gender,
          birthdate: formData.dob ? dayjs(formData.dob).format('YYYY-MM-DD') : '',
          password: formData.password,
          token: null,
          createdDate: dayjs().format('YYYY-MM-DD'),
          status: "Active",
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      toast({
        title: 'Đăng ký thành công!',
        description: 'Tài khoản của bạn đã được tạo thành công.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
      });
      onClose(); 
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Đăng ký không thành công.',
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
      open={open}
      onClose={onClose}
      center
      styles={{
        modal: {
          width: '600px',
          maxWidth: '90%',
          padding: '20px',
          borderRadius: '10px',
        },
        overlay: {
          background: 'rgba(0, 0, 0, 0.5)',
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
          <h5 className="text-lg font-bold capitalize">Đăng ký tài khoản</h5>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <TextField
              fullWidth
              label='Họ và tên'
              variant='outlined'
              name='fullName'
              placeholder='Nhập Họ và tên'
              value={formData.fullName}
              required
              onChange={handleChange}
            />
            {errors.fullName && <FormHelperText error>{errors.fullName}</FormHelperText>}
          </div>
          <div className='mb-4'>
            <TextField
              fullWidth
              label='Email'
              variant='outlined'
              type='email'
              name='email'
              placeholder='Nhập Email'
              value={formData.email}
              required
              onChange={handleChange}
            />
            {errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
          </div>

          <div className='mb-4'>
            <TextField
              fullWidth
              label='Số điện thoại'
              variant='outlined'
              name='phone'
              placeholder='Nhập Số điện thoại'
              value={formData.phone}
              required
              onChange={handleChange}
            />
            {errors.phone && <FormHelperText error>{errors.phone}</FormHelperText>}
          </div>

          <div  className='mb-4 flex flex-row justify-between items-center'>
          <div className='mb-4'>
            <FormLabel>Giới tính</FormLabel>
            <RadioGroup
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              row
            >
              <FormControlLabel value="Male" control={<Radio />} label="Nam" />
              <FormControlLabel value="Female" control={<Radio />} label="Nữ" className='ml-2'/>
            </RadioGroup>
          </div>

          <div className='mb-4'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Ngày sinh"
                value={formData.dob}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            {errors.dob && <FormHelperText error>{errors.dob}</FormHelperText>}
          </div>
          </div>

          <div className='mb-4'>
            <TextField
              fullWidth
              label='Mật khẩu'
              variant='outlined'
              type={showPassword ? 'text' : 'password'}
              name='password'
              placeholder='Nhập Mật khẩu'
              value={formData.password}
              required
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
          </div>
          <div className='mb-4'>
            <TextField
              fullWidth
              label="Xác nhận mật khẩu"
              variant="outlined"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.confirmPassword && <FormHelperText error>{errors.confirmPassword}</FormHelperText>}
          </div>

          <div className='mb-4'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  name="termsAccepted"
                />
              }
              label="Tôi đồng ý với điều khoản dịch vụ"
            />
            {errors.termsAccepted && <FormHelperText error>{errors.termsAccepted}</FormHelperText>}
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 2, mt: 2 }}
          >
            Đăng ký
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default SignUp;
