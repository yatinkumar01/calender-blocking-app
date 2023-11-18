import './App.css';
import React, { useState } from 'react';
import Form from './components/Form';
import Dashboard from './components/Dashboard';
import { Box, Button } from '@chakra-ui/react';
import {PiPlusBold} from 'react-icons/pi'
<<<<<<< Updated upstream
=======
import EventScheduler from './components/AddEvent';
import EventApp from './components/AddEvent';
import backgroundImg from "./formbg.jpg";
// import Dashboard2 from './components/Dashboard2';
>>>>>>> Stashed changes

function App() {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  // const backgroundImage = "url('path/to/background.jpg')";.

  const renderComponent = () => {
    switch (activeComponent) {
      case "form":
        return <Form />;
      default:
        return <Dashboard />;
    }
  };
  return (
    <Box className="App" >
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
      <Box className="body-box" backgroundImage={backgroundImg} backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat">{renderComponent()}</Box>
      {/* <EventApp/> */}
    </Box>
  );
}

export default App;
