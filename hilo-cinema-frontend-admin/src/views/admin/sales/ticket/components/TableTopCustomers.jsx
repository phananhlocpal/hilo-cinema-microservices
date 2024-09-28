import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, searchCustomers } from 'reduxHilo/actions/customerAction'; // Import các actions cần thiết
import ModalAlert from 'components/alert/modalAlert';

const TopCustomerTable = ({ customers, loading, error, onSelectCustomer }) => {
  const dispatch = useDispatch();
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const [searchValue, setSearchValue] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 3;
  const [showTable, setShowTable] = useState(false);

  const searchResults = useSelector((state) => state.customer?.searchResults); // Sử dụng optional chaining

  const handleSearch = () => {
    if (!searchValue.trim()) {
      setValidationError('Search value cannot be empty.');
      setIsAlertVisible(true);
      return;
    }

    setValidationError('');
    dispatch(searchCustomers(searchValue)); // Dispatch action để tìm kiếm khách hàng
    setShowTable(true);
  };

  const closeAlert = () => {
    setIsAlertVisible(false);
  };

  const handleReset = () => {
    setSearchValue('');
    dispatch(fetchCustomers()); // Khôi phục danh sách khách hàng ban đầu
    setIsExpanded(false);
    setCurrentPage(1);
    setShowTable(false);
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    if (onSelectCustomer) {
      onSelectCustomer(customer.id); // Gọi callback với customerId
    }
  };

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Box color="red">{error}</Box>; 
  }

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = (searchResults?.length > 0 ? searchResults : customers ?? []).slice(indexOfFirstCustomer, indexOfLastCustomer);

  return (
    <Flex direction="column" w="100%" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Flex align={{ sm: 'flex-start', lg: 'center' }} justify="space-between" w="100%" px="22px" pb="20px" mb="10px" boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)">
        <Text color={textColor} fontSize="xl" fontWeight="600" cursor="pointer" onClick={handleReset}>
          Customers 
        </Text>
        <Button variant="action" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Hide' : 'See all'} 
        </Button>
      </Flex>

      {isExpanded && (
        <>
          <Flex mb={4} px="22px" align="center">
            <Input
              placeholder="Search by name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              mr={2}
            />
            <Button onClick={handleSearch}>Search</Button>
          </Flex>

          {showTable && (
            <Box>
              <Table variant="simple" color="gray.500" mt="12px">
                <Thead color={textColor}>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Phone</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody color={textColor}>
                  {currentCustomers.map((customer) => (
                    <Tr key={customer.id}>
                      <Td>{customer.name}</Td>
                      <Td>{customer.phone}</Td>
                      <Td>
                        <Button
                          onClick={() => handleSelectCustomer(customer)} 
                          colorScheme="blue"
                          size="sm"
                        >
                          Select 
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Flex justifyContent="center" alignItems="center" mt="4">
                <div className="flex space-x-2">
                  {[...Array(Math.ceil((searchResults?.length > 0 ? searchResults : customers ?? []).length / customersPerPage))].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-white text-blue-500"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </Flex>
            </Box>
          )}

          <ModalAlert
            message={validationError}
            type="error"
            isVisible={isAlertVisible}
            onClose={closeAlert}
          />
        </>
      )}
    </Flex>
  );
}

export default TopCustomerTable;
