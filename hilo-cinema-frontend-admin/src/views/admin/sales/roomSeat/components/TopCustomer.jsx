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
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, searchCustomers, clearSearchResults } from 'reduxHilo/actions/customerAction'; // Import clearSearchResults
import ModalAlert from 'components/alert/modalAlert';

const TopCustomerTable = ({ customers, loading, error }) => {
  const dispatch = useDispatch();
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const [searchValue, setSearchValue] = useState('');
  const [searchField, setSearchField] = useState('name'); // Trường tìm kiếm mặc định là name
  const [validationError, setValidationError] = useState(''); // State để lưu lỗi
  const [isAlertVisible, setIsAlertVisible] = useState(false); // State để kiểm soát hiển thị ModalAlert

  const searchResults = useSelector((state) => state.customer.searchResults);

  const handleSearch = () => {
    // Validate input trước khi thực hiện tìm kiếm
    if (!searchValue.trim()) {
      setValidationError('Search value cannot be empty.');
      setIsAlertVisible(true); // Hiển thị ModalAlert khi có lỗi
      return;
    }

    if (!['name', 'email', 'phone'].includes(searchField)) {
      setValidationError('Invalid search field.');
      setIsAlertVisible(true); // Hiển thị ModalAlert khi có lỗi
      return;
    }

    // Xóa lỗi và thực hiện tìm kiếm nếu không có lỗi
    setValidationError('');
    dispatch(searchCustomers(searchValue, searchField));
  };

  const closeAlert = () => {
    setIsAlertVisible(false); // Đóng ModalAlert khi nhấn nút "Close"
  };

  const handleReset = () => {
    // Reset lại state của searchValue và searchResults
    setSearchValue('');
    dispatch(clearSearchResults()); // Clear search results
    dispatch(fetchCustomers()); // Gọi action để lấy lại danh sách khách hàng gốc
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

  return (
    <Flex direction="column" w="100%" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Flex align={{ sm: 'flex-start', lg: 'center' }} justify="space-between" w="100%" px="22px" pb="20px" mb="10px" boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)">
        <Text color={textColor} fontSize="xl" fontWeight="600" cursor="pointer" onClick={handleReset}>
          Customers
        </Text>
        <Button variant="action">See all</Button>
      </Flex>

      {/* Search Input and Select Field */}
      <Flex mb={4} px="22px" align="center">
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          mr={2}
        />
        <Button onClick={handleSearch}>Search</Button>
      </Flex>

      <Box>
        <Table variant="simple" color="gray.500" mt="12px">
          <Thead color={textColor}>
            <Tr>
              <Th>Name</Th>
              <Th>Gender</Th>
              
            </Tr>
          </Thead>
          <Tbody color={textColor}>
            {(searchResults.length > 0 ? searchResults : customers).map((customer) => (
              <Tr key={customer.id}>
                <Td>{customer.name}</Td>
                <Td>{customer.gender}</Td>
                
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* ModalAlert để hiển thị lỗi */}
      <ModalAlert
        message={validationError}
        type="error"
        isVisible={isAlertVisible}
        onClose={closeAlert}
      />
    </Flex>
  );
};

export default TopCustomerTable;
