import './App.css';
import React, { useState } from 'react';
import Form from './components/Form';
import Dashboard from './components/Dashboard';
import { Box, Button } from '@chakra-ui/react';
import {PiPlusBold} from 'react-icons/pi'

function App() {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  const renderComponent = () => {
    switch (activeComponent) {
      case "form":
        return <Form />;
      default:
        return <Dashboard />;
    }
  };
  return (
    <Box className="App">
      <Box className="navbar">
        <Button
          colorScheme="purple"
          leftIcon={<PiPlusBold />}
          onClick={() => setActiveComponent("form")}
        >
          Create event
        </Button>
        <Button
          colorScheme="purple"
          onClick={() => setActiveComponent("dashboard")}
        >
          Dashboard
        </Button>
      </Box>
      <Box className="body-box">{renderComponent()}</Box>
      {/* <EventApp/> */}
    </Box>
  );
}

export default App;
