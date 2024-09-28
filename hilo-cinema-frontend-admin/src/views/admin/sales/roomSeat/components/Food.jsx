import React from "react";
import { Flex, Image, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card.js";

// Import tất cả các hình ảnh
import betaComboImage from 'assets/img/img-food/beta-combo-69oz.png';
import betaSeemeImage from 'assets/img/img-food/beta-seeme.png';
import betaFamilyImage from 'assets/img/img-food/beta-family.png';

// Tạo đối tượng ánh xạ cho hình ảnh
const imageMappings = {
  'img-food/beta-combo-69oz.png': betaComboImage,
  'img-food/beta-seeme.png': betaSeemeImage,
  'img-food/beta-family.png': betaFamilyImage,
};

export default function Concessions({ image, name, cost }) {
  const textColor = useColorModeValue("brands.900", "white");
  const bgItem = useColorModeValue(
    { bg: "white", boxShadow: "0px 40px 58px -20px rgba(112, 144, 176, 0.12)" },
    { bg: "navy.700", boxShadow: "unset" }
  );

  // Lấy đường dẫn hình ảnh từ đối tượng ánh xạ
  const imagePath = imageMappings[image] || '';

  return (
    <Card
      _hover={bgItem}
      bg='transparent'
      boxShadow='unset'
      px='24px'
      py='21px'
      transition='0.2s linear'>
      <Flex direction={{ base: "column" }} justify='center'>
        <Flex position='relative' align='center'>
          <Image src={imagePath} w='66px' h='66px' borderRadius='20px' me='16px' />
          <Flex
            direction='column'
            w={{ base: "70%", md: "100%" }}
            me={{ base: "4px", md: "32px", xl: "10px", "3xl": "32px" }}>
            <Text
              color={textColor}
              fontSize={{ base: "md" }}
              mb='5px'
              fontWeight='bold'
              me='14px'>
              {name}
            </Text>
          </Flex>
          <Flex me={{ base: "4px", md: "32px", xl: "10px", "3xl": "32px" }} align='center'>
            <Text fontWeight='700' fontSize='md' color={textColor}>
              {cost}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
