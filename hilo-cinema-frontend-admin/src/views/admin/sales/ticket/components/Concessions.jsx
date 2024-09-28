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
import { fetchFoods, searchFoodByName } from 'reduxHilo/actions/foodAction'; 
import ModalAlert from 'components/alert/modalAlert';

const TopFoodTable = ({ foods, loading, error, onSelectFood }) => {
  const dispatch = useDispatch();
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const [searchValue, setSearchValue] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const foodsPerPage = 3;
  const [showTable, setShowTable] = useState(false);

  // Trạng thái lưu trữ số lượng của từng món ăn
  const [quantities, setQuantities] = useState({});

  const searchResults = useSelector((state) => state.food?.searchResults);

  const handleSearch = () => {
    if (!searchValue.trim()) {
      setValidationError('Search value cannot be empty.');
      setIsAlertVisible(true);
      return;
    }

    setValidationError('');
    dispatch(searchFoodByName(searchValue)); 
    setShowTable(true);
  };

  const closeAlert = () => {
    setIsAlertVisible(false);
  };

  const handleReset = () => {
    setSearchValue('');
    dispatch(fetchFoods()); 
    setIsExpanded(false);
    setCurrentPage(1);
    setShowTable(false);
  };

  const handleSelectFood = (food) => {
    const quantity = quantities[food.id] || 1;
    console.log(`Selected food with ID ${food.id} has quantity:`, quantity);
    
    setSelectedFood({ ...food, quantity });
    
    if (onSelectFood) {
      onSelectFood(food.id, quantity);
    }
  };

  // Hàm xử lý khi thay đổi số lượng
  const handleQuantityChange = (foodId, change) => {
    setQuantities((prevQuantities) => {
      const newQuantity = Math.max(1, (prevQuantities[foodId] || 1) + change);
      console.log(`Updating quantity for foodId ${foodId}:`, newQuantity);
      return {
        ...prevQuantities,
        [foodId]: newQuantity,
      };
    });
  };

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Box color="red">{error}</Box>; 
  }

  const indexOfLastFood = currentPage * foodsPerPage;
  const indexOfFirstFood = indexOfLastFood - foodsPerPage;
  const currentFoods = (searchResults?.length > 0 ? searchResults : foods ?? []).slice(indexOfFirstFood, indexOfLastFood);

  return (
    <Flex direction="column" w="100%" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Flex align={{ sm: 'flex-start', lg: 'center' }} justify="space-between" w="100%" px="22px" pb="20px" mb="10px" boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)">
        <Text color={textColor} fontSize="xl" fontWeight="600" cursor="pointer" onClick={handleReset}>
          Foods 
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
                    <Th></Th>
                    <Th>Name</Th>
                    <Th>Price</Th>
                    <Th>Quantity</Th>
                    <Th></Th> {/* Thêm một cột để chứa nút Select */}
                  </Tr>
                </Thead>
                <Tbody color={textColor}>
                  {currentFoods.map((food) => (
                    <Tr key={food.id}>
                      <Td>
                        {food.imgBase64 && (
                          <img src={`data:image/jpeg;base64,${food.imgBase64}`} alt={food.name} style={{ maxWidth: '50px' }} />
                        )}
                      </Td>
                      <Td>{food.name}</Td>
                      <Td>{food.price}</Td>
                      <Td>
                        <Flex align="center">
                          <Button size="sm" onClick={() => handleQuantityChange(food.id, -1)}>-</Button>
                          <Text mx={2}>{quantities[food.id] || 1}</Text>
                          <Button size="sm" onClick={() => handleQuantityChange(food.id, 1)}>+</Button>
                        </Flex>
                      </Td>
                      <Td>
                        <Button
                          onClick={() => handleSelectFood(food)}
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
                  {[...Array(Math.ceil((searchResults?.length > 0 ? searchResults : foods ?? []).length / foodsPerPage))].map((_, index) => (
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

export default TopFoodTable;
