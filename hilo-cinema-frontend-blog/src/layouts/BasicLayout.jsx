import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import SidebarWithHeader from './SideBar';
import useCheckTokenExpiration from '../hooks/useCheckTokenExpiration';

const BasicLayout = () => {
    //useCheckTokenExpiration();
    
    return (
        <Box minH="100vh">
            <SidebarWithHeader />
            <Box ml={{ base: 0, md: 60 }} p="4">
                <Outlet />
            </Box>
        </Box>
    );
};

export default BasicLayout;
