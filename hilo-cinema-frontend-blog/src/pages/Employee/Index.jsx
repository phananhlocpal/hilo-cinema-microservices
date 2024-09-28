import { useState, useEffect } from "react";
import axios from "axios";
import { TableContainer, Table, Thead, Tr, Th, Td, Tbody, Button, Input, Flex } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import CreateEmployeeModal from "./create";
import UpdateEmployeeModal from "./update";
import MyAlertDialog from "../../components/commom_component/alerts/AlertDialog";

const EmployeePage = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [isUpdateOpen, setUpdateOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false); // Changed name from `isAlertOpen` to `isAlertOpen`
    const [employeeToDisable, setEmployeeToDisable] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // const { isOpen: isAlertDialogOpen, onOpen: onAlertDialogOpen, onClose: onAlertDialogClose } = useDisclosure(); // Renamed

    const fetchEmployees = async () => {
        const token = localStorage.getItem("jwtToken");

        try {
            const response = await axios.get("http://localhost:8000/EmployeeService", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Site: "admin",
                },
            });
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const disableEmployee = async (employeeId) => {
        const token = localStorage.getItem("jwtToken");
    
        try {
            await axios.put(`http://localhost:8000/EmployeeService/${employeeId}/disable`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Site: "admin",
                },
            });
            fetchEmployees(); 
        } catch (error) {
            console.error("Error disabling employee:", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleCreateOpen = () => setCreateOpen(true);
    const handleCreateClose = () => setCreateOpen(false);

    const handleUpdateOpen = (employee) => {
        setSelectedEmployee(employee);
        setUpdateOpen(true);
    };
    const handleUpdateClose = () => {
        setUpdateOpen(false);
        setSelectedEmployee(null);
    };

    const handleAlertOpen = (employee) => {
        setEmployeeToDisable(employee);
        setIsAlertOpen(true);
    };

    const handleAlertClose = () => {
        setIsAlertOpen(false);
        setEmployeeToDisable(null);
    };

    const handleConfirmDisable = () => {
        if (employeeToDisable) {
            disableEmployee(employeeToDisable.id);
            handleAlertClose();
        }
    };

    const filteredEmployees = employees
        // .filter((employee) => employee.status == "Active")
        .filter((employee) => employee.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="mx-5 my-5">
            <h1 className="ml-5 mb-5 font-bold text-3xl">Quản lý nhân viên</h1>
            <div className="flex justify-between mb-5">
                <Button
                    colorScheme="blue"
                    className="ml-5"
                    onClick={handleCreateOpen}
                    _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                    }}
                >
                    Tạo mới
                </Button>
                <Input
                    placeholder="Tìm kiếm nhân viên"
                    style={{ width: "25rem" }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <TableContainer>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Tên</Th>
                            <Th>Email</Th>
                            <Th>Điện thoại</Th>
                            <Th>Địa chỉ</Th>
                            <Th>Giới tính</Th>
                            <Th>Ngày sinh</Th>
                            <Th isNumeric>Hành động</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredEmployees.map((employee) => (
                            <Tr key={employee.id}>
                                <Td>{employee.name}</Td>
                                <Td>{employee.email}</Td>
                                <Td>{employee.phone}</Td>
                                <Td>{employee.address}</Td>
                                <Td>{employee.gender}</Td>
                                <Td>{employee.birthdate}</Td>
                                <Td>
                                    <Flex justify="flex-end">
                                        <Button
                                            leftIcon={<EditIcon />}
                                            colorScheme="yellow"
                                            variant="solid"
                                            mr={2}
                                            onClick={() => handleUpdateOpen(employee)}
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            leftIcon={<DeleteIcon />}
                                            colorScheme="red"
                                            variant="solid"
                                            mr={2}
                                            onClick={() => handleAlertOpen(employee)}
                                        >
                                            Xóa
                                        </Button>
                                    </Flex>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <CreateEmployeeModal isOpen={isCreateOpen} onClose={handleCreateClose} fetchEmployees={fetchEmployees} />
            {selectedEmployee && (
                <UpdateEmployeeModal
                    employee={selectedEmployee}
                    isOpen={isUpdateOpen}
                    onClose={handleUpdateClose}
                    fetchEmployees={fetchEmployees}
                />
            )}
            <MyAlertDialog
                title="Xóa nhân viên"
                content={`Bạn có chắc chắn muốn xóa nhân viên "${employeeToDisable?.name}" không?`}
                isOpen={isAlertOpen}
                onClose={handleAlertClose}
                onConfirm={handleConfirmDisable}
            />
        </div>
    );
};

export default EmployeePage;
