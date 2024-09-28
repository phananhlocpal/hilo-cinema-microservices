import React from "react";
import darkLogo from '../../../assets/img/darkLogo.png';
import lightLogo from '../../../assets/img/lightLogo.png';
// Chakra imports
import { Flex, useColorModeValue } from "@chakra-ui/react";

import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  // Sử dụng useColorModeValue để xử lý logic màu sắc dựa trên chế độ màu
  const logo = useColorModeValue(darkLogo, lightLogo);

  return (
    <Flex align='center' direction='column'>
      <img src={logo} style={{ width: 150 }} alt="Logo" />
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
