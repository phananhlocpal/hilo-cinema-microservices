import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Flex,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { fetchEmployees, updateEmployeeStatus } from "reduxHilo/actions/employeeAction"; // Updated imports
import Card from "components/card/Card";
import EmployeeMenu from "components/menu/EmployeeMenu";
import EditEmployeeForm from "./EditEmployee";
import ModalAlert from "components/alert/modalAlert";

export default function EmployeeList(props) {
  const { columnsData } = props;
  const columns = useMemo(() => columnsData, [columnsData]);

  const dispatch = useDispatch();
  const { loading, employees, error } = useSelector((state) => state.employee);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filterInput, setFilterInput] = useState("");
  
  // State for ModalAlert
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");


  const positions = useMemo(() => {
    const posSet = new Set();
    if (employees && employees.length > 0) {
      employees.forEach((employee) => {
        if (employee.position) {
          posSet.add(employee.position);
        }
      });
    }
    return Array.from(posSet);
  }, [employees]);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);
  
  const data = useMemo(() => {
    if (!employees || employees.length === 0) return [];
    return employees
      .filter((employee) => employee.status !== "Inactive") // Exclude inactive employees
      .filter((employee) =>
        filterInput
          ? employee.position &&
            employee.position.toLowerCase().includes(filterInput.toLowerCase())
          : true
      );
  }, [employees, filterInput]);

  const handleEdit = (row) => {
    console.log("Row data:", row);
    if (!row || !row.original) {
      console.error("Row or original data is undefined.");
      return;
    }
    setSelectedEmployee(row.original);
    onOpen();
  };

  const handleDelete = (row) => {
    const employeeId = row?.original?.id;
    if (!employeeId) {
      console.error("ID is undefined.");
      return;
    }
  
    dispatch(updateEmployeeStatus(employeeId))
      .then(() => {
        setModalMessage("Employee has been successfully hidden.");
        setModalType("success");
        setModalVisible(true);
  
        // Reload the employees list after successful update
        dispatch(fetchEmployees()).then(() => {
          // Ensure that selectedEmployee is cleared if it no longer exists
          setSelectedEmployee(null);
        });
      })
      .catch((error) => {
        setModalMessage("Failed to hide employee. Please try again.");
        setModalType("error");
        setModalVisible(true);
        console.error("Failed to update employee status:", error);
      });
  };
  

  const columnsWithActions = useMemo(
    () => [
      ...columns,
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div>
            <Button onClick={() => handleEdit(row)} mr="10px">
              Edit
            </Button>
            <Button onClick={() => handleDelete(row)} colorScheme="red">
              Hide
            </Button>
          </div>
        ),
      },
    ],
    [columns]
  );

  const tableInstance = useTable(
    {
      columns: columnsWithActions,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    pageOptions,
    gotoPage,
    state: { pageIndex },
  } = tableInstance;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  return (
    <>
      <Card
        direction="column"
        w="100%"
        px="0px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Flex px="25px" justify="space-between" mb="20px" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Employees
          </Text>
          <EmployeeMenu></EmployeeMenu>
        </Flex>
        <Flex mb="20px" px="25px" justify="space-between" align="center">
          <Select
            placeholder="Filter by position"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            maxW="300px"
          >
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </Select>
        </Flex>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : !employees || employees.length === 0 ? (
          <Text>No employees found.</Text>
        ) : (
          <>
            <Table
              {...getTableProps()}
              variant="simple"
              mb="24px"
            >
              <Thead>
                {headerGroups.map((headerGroup, index) => (
                  <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                    {headerGroup.headers.map((column, index) => (
                      <Th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        key={index}
                        borderColor={borderColor}
                      >
                        <div className="flex justify-between items-center">
                          {column.render("Header")}
                        </div>
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody {...getTableBodyProps()} color={textColor}>
                {page.map((row, index) => {
                  prepareRow(row);
                  return (
                    <Tr {...row.getRowProps()} key={index}>
                      {row.cells.map((cell, index) => (
                        <Td
                          {...cell.getCellProps()}
                          key={index}
                          borderColor="transparent"
                        >
                          {cell.render("Cell")}
                        </Td>
                      ))}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>

            <Flex justifyContent="center" alignItems="center" mt="4">
              <div className="flex space-x-2">
                {pageOptions.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => gotoPage(pageNumber)}
                    className={`px-3 py-1 border rounded ${
                      pageIndex === pageNumber
                        ? "bg-blue-500 text-white"
                        : "bg-white text-blue-500"
                    }`}
                  >
                    {pageNumber + 1}
                  </button>
                ))}
              </div>
            </Flex>
          </>
        )}
      </Card>

      {selectedEmployee && (
        <EditEmployeeForm
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setSelectedEmployee(null); // Clear the selected employee after closing
          }}
          fetchEmployees={() => dispatch(fetchEmployees())}
          employeeId={selectedEmployee ? selectedEmployee.id : null}
        />
      )}

      {/* Modal Alert */}
      <ModalAlert
        message={modalMessage}
        type={modalType}
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}
