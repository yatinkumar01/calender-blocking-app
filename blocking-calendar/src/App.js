import './App.css';
import React, { useState } from 'react';
import Form from './components/Form';
import Dashboard from './components/Dashboard';
import Logs from './components/Logs';
import { Box, Button } from '@chakra-ui/react';
import {PiPlusBold} from 'react-icons/pi'
import EventScheduler from './components/AddEvent';
import EventApp from './components/AddEvent';
import Dashboard2 from './components/Dashboard2';

function App() {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  const renderComponent = () => {
    switch (activeComponent) {
      case "form":
        return <Form />;
      case "log":
        return <Logs />;
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
        <Button colorScheme="purple" onClick={() => setActiveComponent("log")}>
          Logs
        </Button>
      </Box>
      <Box className="body-box">{renderComponent()}</Box>
      {/* <EventApp/> */}
    </Box>
  );
}

export default App;
