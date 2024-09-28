// chakra imports
import { Box, Flex, Stack } from "@chakra-ui/react";
//   Custom components
import SidebarBrand from "./Brand";
// import Links from "components/sidebar/components/Links";

// FUNCTIONS

function NavBarTextBox(props) {
  const { routes } = props;
  // SIDEBAR
  return (
    <Flex direction='column' height='100%' pt='25px' px="16px" borderRadius='30px'>
      <SidebarBrand />
      <Stack direction='column' mb='auto' mt='8px'>
        <Box ps='20px' pe={{ md: "16px", "2xl": "1px" }}>
          {/* <Links routes={routes} /> */}
        </Box>
      </Stack>

      <Box
        mt='60px'
        mb='40px'
        borderRadius='30px'>
      </Box>
    </Flex>
  );
}

export default NavBarTextBox;
