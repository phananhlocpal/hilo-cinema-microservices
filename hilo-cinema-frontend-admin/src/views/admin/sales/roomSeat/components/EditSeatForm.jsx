import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSeatById, editSeat, fetchSeats, fetchSeatsByRoom } from "../../../../../reduxHilo/actions/seatAction";
import { useColorModeValue, Button, ModalFooter, Input, Select } from "@chakra-ui/react";

export default function EditSeatForm({ seatId, onClose }) {
    const dispatch = useDispatch();
    const seat = useSelector((state) =>
        state.seat.seats.find((s) => s.id === seatId)
    );

    const [formData, setFormData] = useState({
        name: "",
        type: "",
        status: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (seat) {
            setFormData({ ...seat });
        } else {
            dispatch(fetchSeatById(seatId)); // Tải thông tin chi tiết ghế nếu không tìm thấy trong state
        }
    }, [seat, seatId, dispatch]);

    useEffect(() => {
        if (seat) {
            setFormData({ ...seat });
        }
    }, [seat]);

    const validate = () => {
        let validationErrors = {};

        if (!formData.name) {
            validationErrors.name = "Name is required";
        }
        if (!formData.type) {
            validationErrors.type = "Type is required";
        }
        if (!formData.status) {
            validationErrors.status = "Status is required";
        }

        return validationErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    // handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            try {
                await dispatch(editSeat(seatId, formData));
                alert("Cập nhật ghế thành công");
                onClose();
                dispatch(fetchSeatsByRoom(seat.roomId)); // Cập nhật danh sách ghế sau khi chỉnh sửa
            } catch (error) {
                console.error("Error updating seat:", error.response ? error.response.data : error.message);
            }
        }
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <label>Type:</label>
                <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                >
                    <option value="standard">Standard</option>
                    <option value="vip">VIP</option>
                    <option value="couple">Couple</option>
                </Select>

                <label>Status:</label>
                <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </Select>

                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleSubmit}>
                        Save
                    </Button>
                    <Button onClick={onClose} marginLeft={2}>
                        Close
                    </Button>
                </ModalFooter>
            </form>
        </div>
    );
}
