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
import { fetchCustomers } from "reduxHilo/actions/customerAction";
import Card from "components/card/Card";
import EditCustomerForm from "./EditCustomer";
import CustomerMenu from "components/menu/CustomerMenu";
import { hideCustomer } from "reduxHilo/actions/customerAction";
import ModalAlert from "components/alert/modalAlert";

export default function CustomerList(props) {
  const { columnsData } = props;
  const columns = useMemo(() => columnsData, [columnsData]);

  const dispatch = useDispatch();
  const { loading, customers, error } = useSelector((state) => state.customer);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filterInput, setFilterInput] = useState("");
  const [phoneFilterInput, setPhoneFilterInput] = useState(""); // State cho số điện thoại

  // State for ModalAlert
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const addresses = useMemo(() => {
    const addressSet = new Set();
    customers.forEach((customer) => {
      if (customer.address) {
        addressSet.add(customer.address);
      }
    });
    return Array.from(addressSet);
  }, [customers]);

  const data = useMemo(() => {
    return customers
      .filter((customer) => customer.status !== "Inactive") // Exclude inactive customers
      .filter((customer) =>
        filterInput
          ? customer.address &&
            customer.address.toLowerCase().includes(filterInput.toLowerCase())
          : true
      )
      .filter((customer) =>
        phoneFilterInput
          ? customer.phone &&
            customer.phone.toLowerCase().includes(phoneFilterInput.toLowerCase())
          : true
      );
  }, [customers, filterInput, phoneFilterInput]);

  const handleEdit = (row) => {
    setSelectedCustomer(row.original);
    onOpen();
  };

  const handleHide = (row) => {
    const customerId = row?.original?.id;
    if (!customerId) {
      console.error("ID is undefined.");
      return;
    }

    dispatch(hideCustomer(customerId))
      .then(() => {
        setModalMessage("Customer has been successfully hidden.");
        setModalType("success");
        setModalVisible(true);

        // Reload the customers list after successful update
        dispatch(fetchCustomers()).then(() => {
          // Ensure that selectedCustomer is cleared if it no longer exists
          setSelectedCustomer(null);
        });
      })
      .catch((error) => {
        setModalMessage("Failed to hide customer. Please try again.");
        setModalType("error");
        setModalVisible(true);
        console.error("Failed to update customer status:", error);
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
            <Button onClick={() => handleHide(row)} colorScheme="red">
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
            Customers
          </Text>
          <CustomerMenu></CustomerMenu>
        </Flex>
        <Flex mb="20px" px="25px" justify="space-between" align="center">
          <Select
            placeholder="Filter by address"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            maxW="300px"
          >
            {addresses.map((address) => (
              <option key={address} value={address}>
                {address}
              </option>
            ))}
          </Select>
          <input
            type="text"
            placeholder="Search by phone number"
            value={phoneFilterInput}
            onChange={(e) => setPhoneFilterInput(e.target.value)}
            className="border px-3 py-2 rounded-lg"
            maxW="500px"
          />
        </Flex>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text color="red.500">{error}</Text>
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

      {selectedCustomer && (
        <EditCustomerForm
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setSelectedCustomer(null); // Clear the selected customer after closing
          }}
          fetchCustomers={() => dispatch(fetchCustomers())}
          customerId={selectedCustomer.id}
        />
      )}
      <ModalAlert
        message={modalMessage}
        type={modalType}
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}
