import React, { useState } from 'react';
import { 
    Button,
    Drawer, 
    DrawerBody, 
    DrawerCloseButton, 
    DrawerContent, 
    DrawerHeader, 
    DrawerOverlay, 
    Flex,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Box
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

function ActiveChatReference(props) {
    return (
        <Flex alignItems='center'
            justifyContent='center'
            w='80%'
            p='15px 30px'
            mb='15px'
            borderRadius='10px'
            bgColor='whiteAlpha.300'
            color='orange.300'
            fontWeight='bold'
            _hover={{
                bgColor: 'gray.900',
                border: '1px solid #474950',
                cursor: 'pointer'
            }}
        >
            {props.userName}
        </Flex>
    )
}

function SidebarContent(props) {
    const chatServerURL = "http://localhost:8000/chat/startChat";
    const [ modalStatus, toggleModalStatus ] = useState(false);
    const [userName,setUserName] = useState(props.userName);
    const [friendName,setFriendName] = useState('');

    function changeModalStatus() {
        toggleModalStatus(!modalStatus);
    }

    function startChat(){
        fetch(chatServerURL, {
            method: "POST",
            body: JSON.stringify({userName : userName,receiver : friendName}),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
             }
        })
        .then(response => console.log(response))
        .catch((err) => alert('Could not add friend, try again with valid input. \n', err))
    }

    return (
    <>
        <Flex 
            flexDir='column'
            w={['100%', '100%', '400px']}
            minH='100%'
            bgColor='whiteAlpha.200'
            alignItems='center'
        >
            <Box as='span' my='20px' fontSize='1.5rem' fontWeight='700' color='whiteAlpha.700'>
                Welcome {props.userName}
            </Box>
            <Flex alignItems='center'
                justifyContent='center'
                w='80%' 
                p='15px 30px'
                mb='30px'
                borderRadius='10px'
                bgColor='orange.300'
                color='gray.900'
                fontWeight='bold'
                _hover={{
                    cursor: 'pointer',
                    bgColor: '#ED8936'
                }}
                onClick={changeModalStatus}
            >
                <Box as='span'>Start New Chat</Box>
                <Box as='div' ml='10px' borderRadius='100%' p='8px' bgColor='#444444' >
                    <AddIcon fontWeight='900' color='orange.300' display='flex' w='0.75rem' h='0.75rem'/>
                </Box>
            </Flex>

            <ActiveChatReference userName='Yashi' />
            <ActiveChatReference userName='Yashi' />
            <ActiveChatReference userName='Yashi' />

            <Modal 
                isOpen={modalStatus} 
                onClose={changeModalStatus}
            >
                <ModalOverlay />
                <ModalContent 
                    bgColor='#24262e'
                    color='whiteAlpha.700'
                >
                    <ModalHeader>Start New Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                        <Input placeholder='Enter recepient username' 
                            minW={['200px', '300px', '400px']}
                            borderColor='whiteAlpha.400' 
                            focusBorderColor='orange.300'
                            _hover={{ borderColor: 'orange.300' }}
                            onChange = {(event) => {setFriendName(event.target.value)}}
                        />
                    </ModalBody>

                    <ModalFooter>
                    <Button bgColor='orange.300' mr={3} onClick={startChat}>
                        Add Friend
                    </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            
        </Flex>
    </>
    )
}

function Sidebar(props) {
    return (
        props.variant === 'sidebar' ? (
              <SidebarContent userName = {props.userName}/>
          ) : (
            <Drawer isOpen={props.isOpen} placement="right" onClose={props.onClose}>
                <DrawerOverlay>
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>All Chats</DrawerHeader>
                        <DrawerBody>
                            <SidebarContent/>
                        </DrawerBody>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
          )
    );
}

export default Sidebar;