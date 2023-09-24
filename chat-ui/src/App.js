import './App.css';
import { Box, ChakraProvider } from '@chakra-ui/react'
import Navbar from './components/navigation/Navbar';
import BackgroundContainer from './components/hoc/BackgroundContainer';

function App() {
  return (
    <ChakraProvider>
        <BackgroundContainer />
    </ChakraProvider>
  );
}

export default App;
