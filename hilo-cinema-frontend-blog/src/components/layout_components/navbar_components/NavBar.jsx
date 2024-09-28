import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Stack, Icon, Text } from '@chakra-ui/react';
import { FaHome, FaUsers, FaBox, FaMoneyBillWave, FaClock, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <Box
      position="relative"
      overflow="hidden"
      width="100%"
      height="100%"
    >
      <Box
        position="absolute"
        inset="0"
        overflow="scroll"
        marginRight="-17px"
        marginBottom="-22px"
      >
        <Stack spacing={4} p={4}>
          <Box>
            <img
              src="/static/media/darkLogo.e3a34977ae7b3d1bd0d3.png"
              alt="Logo"
              style={{ width: '150px' }}
            />
          </Box>
          
          <Stack spacing={2}>
            <Link to="/admin/default">
              <Stack direction="row" align="center" spacing={2}>
                <Icon as={FaHome} />
                <Text>Main Dashboard</Text>
              </Stack>
            </Link>

            <Box>
              <Stack direction="row" align="center" spacing={2}>
                <Icon as={FaUsers} />
                <Text>Users Management</Text>
              </Stack>
              <Box ml={4}>
                <Link to="/admin/users/customer">
                  <Stack direction="row" align="center" spacing={2}>
                    <Icon as={FaUsers} />
                    <Text>Customer</Text>
                  </Stack>
                </Link>
                <Link to="/admin/users/employee">
                  <Stack direction="row" align="center" spacing={2}>
                    <Icon as={FaUsers} />
                    <Text>Employee</Text>
                  </Stack>
                </Link>
              </Box>
            </Box>

            <Box>
              <Stack direction="row" align="center" spacing={2}>
                <Icon as={FaBox} />
                <Text>Stock Management</Text>
              </Stack>
              <Box ml={4}>
                <Link to="/admin/stock/movie">
                  <Stack direction="row" align="center" spacing={2}>
                    <Icon as={FaBox} />
                    <Text>Movie</Text>
                  </Stack>
                </Link>
                <Link to="/admin/stock/theater">
                  <Stack direction="row" align="center" spacing={2}>
                    <Icon as={FaBox} />
                    <Text>Theater</Text>
                  </Stack>
                </Link>
              </Box>
            </Box>

            <Link to="/admin/sale-management">
              <Stack direction="row" align="center" spacing={2}>
                <Icon as={FaMoneyBillWave} />
                <Text>Sales Management</Text>
              </Stack>
            </Link>

            <Link to="/admin/timekeeping">
              <Stack direction="row" align="center" spacing={2}>
                <Icon as={FaClock} />
                <Text>Time Management</Text>
              </Stack>
            </Link>

            <Link to="/admin/salary">
              <Stack direction="row" align="center" spacing={2}>
                <Icon as={FaMoneyBillWave} />
                <Text>Salary Management</Text>
              </Stack>
            </Link>

            <Link to="/auth/sign-in">
              <Stack direction="row" align="center" spacing={2}>
                <Icon as={FaSignOutAlt} />
                <Text>Sign Out</Text>
              </Stack>
            </Link>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Sidebar;
