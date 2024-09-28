import React from "react";
import darkLogo from '../../../assets/img/darkLogo.png'
import lightLogo from '../../../assets/img/lightLogo.png'
// Chakra imports
import { Flex, useColorMode } from "@chakra-ui/react";

import { HSeparator } from "../../commom_component/separator/Separator";

export function Brand() {
  const { colorMode } = useColorMode();
  const logo = colorMode === 'light' ? darkLogo : lightLogo;
  return (
    <Flex align='center' direction='column'>
      <img src={logo} style={{width:150}} alt="Logo"></img>
      <HSeparator mb='20px' />
    </Flex>
  );  
}

export default Brand;
