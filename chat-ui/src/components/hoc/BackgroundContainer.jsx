import { Flex } from '@chakra-ui/react';
import React from 'react';
import Login from '../pages/Login';
import UserView from './UserView';
import { Route, Routes } from 'react-router-dom';

const BackgroundContainer = () => {
    return (
        <Flex flexDirection='column'
            alignItems='center'    
            bg='#11141c' 
            w='100vw' 
            minH='100vh'
            color='whiteAlpha.800'
      >
        <Routes>
            <Route path='/'
                element={ <Login /> }
            />
            <Route path='/chatView'
                element={ <UserView /> }
            />

        </Routes>
    </Flex>
    );
};

export default BackgroundContainer;