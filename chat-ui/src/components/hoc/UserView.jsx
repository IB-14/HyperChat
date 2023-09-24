import { Flex, useBreakpointValue } from '@chakra-ui/react';
import React, { useState } from 'react';
import Sidebar from '../navigation/Sidebar';
import ChatWindow from '../pages/ChatWindow';
import Navbar from '../navigation/Navbar';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const smVariant = { navigation: 'drawer', navigationButton: true }
const mdVariant = { navigation: 'sidebar', navigationButton: false }


const chatUserHistoryServerURL = "http://localhost:8000/chat/chatUsersHistory";


const UserView = (props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const[userName,setUsername] = useState(searchParams.get('user'));
    const [isSidebarOpen, setSidebarOpen] = useState(false)
    const [userHistory, setUserHistory] = useState([])
    const variants = useBreakpointValue({ base: smVariant, md: mdVariant })

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen)

    useEffect(()=>{
        fetch(chatUserHistoryServerURL, {
            method: "POST",
            body: JSON.stringify({userName : userName}),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
             }
        })
        .then(response => console.log(response))
    },[])

    return (
        <>
            <Navbar 
                showSidebarButton={variants?.navigationButton}
                onShowSidebar={toggleSidebar}
            />
            <Flex h='90vh' w='100vw'>
                <Sidebar 
                    variant={variants?.navigation}
                    isOpen={isSidebarOpen}
                    onClose={toggleSidebar}
                    userName ={userName}
                />
                <ChatWindow />
            </Flex>
        </>
    );
};

export default UserView;