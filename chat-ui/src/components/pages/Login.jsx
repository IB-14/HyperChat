import { Box, Button, Flex, Input } from '@chakra-ui/react';
import React from 'react';
import Navbar from '../navigation/Navbar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const serverURL = "http://localhost:8000/chat/enterUser";


const Login = () => {
    
    const[userName,setUsername] = useState('');
    const navigate = useNavigate();

    function loginUser(){
        let data = {
            userName : userName
        };
        console.log(serverURL, data);
        fetch(serverURL, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin" : "*",
         }
        })
        .then( (response) => {
            console.log(response);
            navigate(`/chatView?user=${userName}`, { replace: true });
        })
        .catch( (err) => {
            alert('There was some issue in logging in\n', err)
        })
    }
    return (
        <>
            <Navbar />
            <Flex flexDir='column'
                justifyContent='space-between'
                p='3em'
            >
                <Box as='span' fontSize='1.5rem' mb='10px'>
                    Welcome to HyperChat
                </Box>
                <Box as='span' color='whiteAlpha.500' mb='50px'>
                    Enter your unique user name and get started 
                </Box>
                <Flex flexDir='column'
                    px='50px'
                    py='25px'
                    alignItems='center'
                    justifyContent='space-between'
                    gap='25px'
                    bg='whiteAlpha.200'
                    borderRadius='10px'
                >

                    <Input placeholder='Enter your username' 
                        minW={['200px', '300px', '400px']}
                        borderColor='whiteAlpha.400' 
                        focusBorderColor='orange.300'
                        _hover={{ borderColor: 'orange.300' }}
                        onChange={(event)=>setUsername(event.target.value)}
                    />

                    <Button bgColor='orange.300' 
                        p='1.5em 2em'
                        _hover={{bgColor: 'orange.400'}}
                        onClick={loginUser}
                    >
                        Start Chatting
                    </Button>
                </Flex>
            </Flex>
        </>
    );
};

export default Login;