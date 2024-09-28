import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    useColorModeValue,
    FormErrorMessage,
    Stack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { addEmployee, fetchEmployees, checkEmailExists } from "reduxHilo/actions/employeeAction";
import ModalAlert from "components/alert/modalAlert";

const AddEmployeeForm = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        gender: '',
        birthdate: '',
        password: '',
        position: '',
        sysRole: '',
        status: '',
    });

    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false); // Trạng thái quản lý hiển thị ModalAlert
    const [alertMessage, setAlertMessage] = useState(""); // Nội dung thông báo trong ModalAlert
    const [alertType, setAlertType] = useState("success"); // Loại thông báo (success/error)

    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        numbers: false,
        specialCharacters: false,
        level: "Empty",
    });

    const validate = async () => {
        let validationErrors = {};

        if (!formData.name) validationErrors.name = 'Name is required';

        if (!formData.email) {
            validationErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            validationErrors.email = 'Email address is invalid';
        } else {
            try {
                const emailExists = await dispatch(checkEmailExists(formData.email));
                if (emailExists) {
                    validationErrors.email = 'Email already exists. Please try another email.';
                }
            } catch (error) {
                validationErrors.email = 'Failed to check email existence. Please try again later.';
            }
        }

        if (!formData.phone) {
            validationErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            validationErrors.phone = 'Phone number must be 10 digits';
        }

        if (!formData.address) validationErrors.address = 'Address is required';

        if (!formData.gender) validationErrors.gender = 'Gender is required';

        if (!formData.birthdate) {
            validationErrors.birthdate = 'Birthdate is required';
        } else {
            const today = new Date();
            const birthDate = new Date(formData.birthdate);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                validationErrors.birthdate = 'Employee must be at least 18 years old';
            }
        }

        if (!formData.password) {
            validationErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            validationErrors.password = 'Password must be at least 6 characters long';
        } else if (!/[A-Z]/.test(formData.password)) {
            validationErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/[!@#$%^&*]/.test(formData.password)) {
            validationErrors.password = 'Password must contain at least one special character';
        }

        if (!formData.position) validationErrors.position = 'Position is required';

        if (!formData.sysRole) validationErrors.sysRole = 'System role is required';

        if (!formData.status) validationErrors.status = 'Status is required';

        return validationErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });  // Clear error when user starts typing
    };

    useEffect(() => {
        const password = formData.password;
        const length = password.length >= 6;
        const lowercase = /[a-z]/.test(password);
        const uppercase = /[A-Z]/.test(password);
        const numbers = /[0-9]/.test(password);
        const specialCharacters = /[!@#$%^&*]/.test(password);

        let level = "Empty";
        const checks = [length, lowercase, uppercase, numbers, specialCharacters];
        const passedChecks = checks.filter(check => check).length;

        switch (passedChecks) {
            case 0:
                level = "Empty";
                break;
            case 1:
            case 2:
                level = "Weak";
                break;
            case 3:
                level = "Medium";
                break;
            case 4:
                level = "Strong";
                break;
            case 5:
                level = "Very Strong";
                break;
            default:
                level = "Empty";
        }

        setPasswordStrength({
            length,
            lowercase,
            uppercase,
            numbers,
            specialCharacters,
            level,
        });
    }, [formData.password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Form submitted");
        const validationErrors = await validate();
        console.log("Validation errors:", validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await dispatch(addEmployee(formData));
            setAlertMessage("Employee added successfully");
            setAlertType("success");
            setShowAlert(true);
            onClose();
            dispatch(fetchEmployees());
        } catch (error) {
            console.error("Error adding employee:", error);
            setAlertMessage("An unexpected error occurred. Please try again.");
            setAlertType("error");
            setShowAlert(true);
        }
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    const formBackgroundColor = useColorModeValue("white", "gray.700");
    const inputBackgroundColor = useColorModeValue("gray.100", "gray.600");
    const textColor = useColorModeValue("black", "white");

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Employee</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={4}>
                                <FormControl id="name" isInvalid={errors.name}>
                                    <FormLabel color={textColor}>Name</FormLabel>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                        _placeholder={{ color: "gray.500" }}
                                    />
                                    {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
                                </FormControl>
                                <FormControl id="email" isInvalid={errors.email}>
                                    <FormLabel color={textColor}>Email</FormLabel>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                        _placeholder={{ color: "gray.500" }}
                                    />
                                    {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
                                </FormControl>
                                <FormControl id="phone" isInvalid={errors.phone}>
                                    <FormLabel color={textColor}>Phone</FormLabel>
                                    <Input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                        _placeholder={{ color: "gray.500" }}
                                    />
                                    {errors.phone && <FormErrorMessage>{errors.phone}</FormErrorMessage>}
                                </FormControl>
                                <FormControl id="address" isInvalid={errors.address}>
                                    <FormLabel color={textColor}>Address</FormLabel>
                                    <Input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                        _placeholder={{ color: "gray.500" }}
                                    />
                                    {errors.address && <FormErrorMessage>{errors.address}</FormErrorMessage>}
                                </FormControl>
                                <FormControl id="gender" isInvalid={errors.gender}>
                                    <FormLabel color={textColor}>Gender</FormLabel>
                                    <Select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </Select>
                                    {errors.gender && <FormErrorMessage>{errors.gender}</FormErrorMessage>}
                                </FormControl>
                                <FormControl id="birthdate" isInvalid={errors.birthdate}>
                                    <FormLabel color={textColor}>Birthdate</FormLabel>
                                    <Input
                                        type="date"
                                        name="birthdate"
                                        value={formData.birthdate}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                        _placeholder={{ color: "gray.500" }}
                                    />
                                    {errors.birthdate && <FormErrorMessage>{errors.birthdate}</FormErrorMessage>}
                                </FormControl>
                                <FormControl id="password" isInvalid={errors.password}>
                                    <FormLabel color={textColor}>Password</FormLabel>
                                    <Input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                        _placeholder={{ color: "gray.500" }}
                                    />
                                    {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
                                    <div id="hs-strong-password-hints" className="mb-3">
                                        <div>
                                            <span className="text-sm text-gray-800 dark:text-neutral-200">Level: </span>
                                            <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200">{passwordStrength.level}</span>
                                        </div>
                                        <div className="flex mt-2 -mx-1">
                                            <div className={`hs-strong-password h-2 flex-auto rounded-full mx-1 ${passwordStrength.level === 'Empty' ? 'bg-gray-300' : ''} ${passwordStrength.level === 'Weak' ? 'bg-red-400' : ''} ${passwordStrength.level === 'Medium' ? 'bg-yellow-400' : ''} ${passwordStrength.level === 'Strong' ? 'bg-green-400' : ''} ${passwordStrength.level === 'Very Strong' ? 'bg-green-600' : ''}`}></div>
                                        </div>
                                        <h4 className="my-2 text-sm font-semibold" color={textColor}>
                                            Your password must contain:
                                        </h4>
                                        <ul className="space-y-1 text-sm text-gray-500 dark:text-neutral-500">
                                            <li className={`flex items-center gap-x-2 ${passwordStrength.length ? 'text-teal-500' : ''}`}>
                                                {passwordStrength.length ? '✔' : '✖'} Minimum number of characters is 6.
                                            </li>
                                            <li className={`flex items-center gap-x-2 ${passwordStrength.lowercase ? 'text-teal-500' : ''}`}>
                                                {passwordStrength.lowercase ? '✔' : '✖'} Should contain lowercase.
                                            </li>
                                            <li className={`flex items-center gap-x-2 ${passwordStrength.uppercase ? 'text-teal-500' : ''}`}>
                                                {passwordStrength.uppercase ? '✔' : '✖'} Should contain uppercase.
                                            </li>
                                            <li className={`flex items-center gap-x-2 ${passwordStrength.numbers ? 'text-teal-500' : ''}`}>
                                                {passwordStrength.numbers ? '✔' : '✖'} Should contain numbers.
                                            </li>
                                            <li className={`flex items-center gap-x-2 ${passwordStrength.specialCharacters ? 'text-teal-500' : ''}`}>
                                                {passwordStrength.specialCharacters ? '✔' : '✖'} Should contain special characters.
                                            </li>
                                        </ul>
                                    </div>
                                </FormControl>
                                <FormControl id="position" isInvalid={errors.position}>
                                    <FormLabel color={textColor}>Position</FormLabel>
                                    <Select
                                        name="position"
                                        value={formData.position}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    >
                                        <option value="">Select Position</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Ticket Seller">Ticket Seller</option>
                                        <option value="Ticket Checker">Ticket Checker</option>
                                        <option value="Technician">Technician</option>
                                        <option value="Cleaner">Cleaner</option>
                                        <option value="Security Guard">Security Guard</option>
                                    </Select>
                                    {errors.position && <FormErrorMessage>{errors.position}</FormErrorMessage>}
                                </FormControl>
                                <FormControl id="sysRole" isInvalid={errors.sysRole}>
                                    <FormLabel color={textColor}>System Role</FormLabel>
                                    <Select
                                        name="sysRole"
                                        value={formData.sysRole}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    >
                                        <option value="">Select System Role</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Employee">Employee</option>
                                    </Select>
                                    {errors.sysRole && <FormErrorMessage>{errors.sysRole}</FormErrorMessage>}
                                </FormControl>
                                <FormControl id="status" isInvalid={errors.status}>
                                    <FormLabel color={textColor}>Status</FormLabel>
                                    <Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        bg={inputBackgroundColor}
                                        border={0}
                                        color={textColor}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </Select>
                                    {errors.status && <FormErrorMessage>{errors.status}</FormErrorMessage>}
                                </FormControl>
                            </Stack>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleSubmit}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <ModalAlert 
                isVisible={showAlert} 
                message={alertMessage} 
                type={alertType} 
                onClose={handleCloseAlert} 
            />
        </>
    );
};

AddEmployeeForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default AddEmployeeForm;
