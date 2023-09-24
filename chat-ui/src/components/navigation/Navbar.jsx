import { Box, Flex, IconButton, Image } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons'
import React from 'react';

const Navbar = (props) => {
    return (
        <Flex 
            w='100vw' 
            p='1em 2em' 
            bgColor='whiteAlpha.200'
            maxH='10vh'
            borderBottom='2px solid #11141c'
        >
            <Image maxW='150px'
                src={process.env.PUBLIC_URL + '/images/HyperChat_Logo.png'} 
            />
            <Box flex="1">
                {props.showSidebarButton && (
                <IconButton
                    icon={<ChevronLeftIcon w={8} h={8} />}
                    color="orange.300"
                    borderColor="orange.300"
                    variant="outline"
                    onClick={props.onShowSidebar}
                    float='right'
                    _focus={{bgColor: '#24262e'}}
                />
                )}
            </Box>
        </Flex>
    );
};

export default Navbar;