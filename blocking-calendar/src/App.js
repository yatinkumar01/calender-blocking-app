import "./App.css";
import React, { useState } from "react";
import Form from "./components/Form";
import Dashboard from "./components/Dashboard";
import { Box, Button } from "@chakra-ui/react";
import { PiPlusBold } from "react-icons/pi";
// import backgroundImg from "./formbg.jpg";

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
      <Box
        className="body-box"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
      >
        {renderComponent()}
      </Box>
      {/* <EventApp/> */}
    </Box>
  );
}

export default App;
