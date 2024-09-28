import { useState, useEffect } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Select, Button } from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";

const UpdateEmployeeModal = ({ employee, isOpen, onClose, fetchEmployees }) => {
    const [name, setName] = useState(employee.name);
    const [email, setEmail] = useState(employee.email);
    const [phone, setPhone] = useState(employee.phone);
    const [address, setAddress] = useState(employee.address);
    const [status, setStatus] = useState(employee.status);
    const [scrollBehavior] = useState('inside');

    useEffect(() => {
        // Reset form state when the modal opens
        if (employee) {
            setName(employee.name);
            setEmail(employee.email);
            setPhone(employee.phone);
            setAddress(employee.address);
            setStatus(employee.status);
        }
    }, [employee, isOpen]);

    const onUpdate = async () => {
        const token = localStorage.getItem("jwtToken");

        const data = {
            id: employee.id, // Use the employee ID
            name: employee.name,
            email: employee.email,
            address: employee.address,
            phone: employee.phone,
            gender: employee.gender, 
            birthdate: employee.birthdate, // Assuming birthdate is part of employee object
            password: employee.password, // Assuming password is part of employee object
            created_date: employee.created_date, // Assuming created_date is part of employee object
            status: status || null,
        };

        try {
            await axios.put(`http://localhost:8000/EmployeeService/${employee.id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    Site: 'admin',
                },
            });
            onClose(); // Close modal on success
            fetchEmployees();
        } catch (error) {
            console.error("Error updating employee:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"} scrollBehavior={scrollBehavior}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Cập nhật khách hàng</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type='email'
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Phone</FormLabel>
                        <Input
                            type='tel'
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Address</FormLabel>
                        <Input
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Status</FormLabel>
                        <Select
                            placeholder="Select Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value='Active'>Active</option>
                            <option value='Inactive'>Inactive</option>
                        </Select>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onUpdate}>
                        Update
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

UpdateEmployeeModal.propTypes = {
    employee: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchEmployees: PropTypes.func.isRequired
};

export default UpdateEmployeeModal;
