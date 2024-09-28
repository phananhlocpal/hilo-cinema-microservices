import React, { useEffect } from "react";
import { Box, Icon, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import { MdAttachMoney, MdMovie, MdConfirmationNumber, MdGroup } from "react-icons/md";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoviesCount } from "reduxHilo/actions/movieAction";  // Import action
import { fetchEmployeesCount } from "reduxHilo/actions/authAction";
import { fetchCustomerCount } from "reduxHilo/actions/customerAction";
import { fetchInvoicesCount } from "reduxHilo/actions/invoiceAction";

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  const dispatch = useDispatch();
  const { count: totalMovies } = useSelector((state) => state.movie);  // Lấy giá trị totalMovies từ state
  const { count: totalEmployees } = useSelector((state) => state.auth);
  const { count: totalCustomers } = useSelector((state) => state.customer);
  const { count: totalTicket } = useSelector((state) => state.invoice);
  useEffect(() => {
    dispatch(fetchMoviesCount());
    dispatch(fetchEmployeesCount());
    dispatch(fetchCustomerCount())
    dispatch(fetchInvoicesCount())
  }, [dispatch]);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 2, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={<Icon w='32px' h='32px' as={MdGroup} color={brandColor} />}
            />
          }
          name='Total Customers'
          value={totalCustomers}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={<Icon w='32px' h='32px' as={MdGroup} color={brandColor} />}
            />
          }
          name='Total Employees'
          value={totalEmployees}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={<Icon w='32px' h='32px' as={MdConfirmationNumber} color={brandColor} />}
            />
          }
          name='Sale Tickets'
          value={totalTicket}
        />
        
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={<Icon w='32px' h='32px' as={MdMovie} color={brandColor} />}
            />
          }
          name='Total Movies'
          value={totalMovies}  // Sử dụng giá trị totalMovies
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <TotalSpent />
        <WeeklyRevenue />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
        </SimpleGrid>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
      </SimpleGrid>
    </Box>
  );
}
