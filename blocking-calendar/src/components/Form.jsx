import React, { useState } from "react";
import axios from "axios";
import {
  Heading,
  Box,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Alert,
  AlertIcon,
  Text
} from "@chakra-ui/react";
import { getCurrentDateTime } from "../utils";

const Form = () => {
  const [formData, setFormData] = useState({
    summary: "",
     description: "",
    startDateTime: "",
    endDateTime: "",
    location: "",
    attendees: [],
  });
  const [alert, setAlert] = useState({
    status: null,
    message: "",
  });

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   const selectedDateTime = new Date(value).getTime();
  //   const currentDateTime = new Date().getTime();

  //   if (selectedDateTime < currentDateTime) {
  //     setFormData({
  //       ...formData,
  //       [name]: getCurrentDateTime(),
  //     });
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [name]: value,
  //     });
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "startDateTime" &&
      new Date(value) > new Date(formData.endDateTime)
    ) {
      setFormData({
        ...formData,
        endDateTime: value,
        [name]: value,
      });
    } else if (
      name === "endDateTime" &&
      new Date(value) < new Date(formData.startDateTime)
    ) {
      // Ensure endDateTime is not smaller than startDateTime
      setFormData({
        ...formData,
        startDateTime: value,
        [name]: value,
      });
    } else if (name === "startDateTime") {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCreateEvent = async () => {
    try {
      const startDateTimeISO = new Date(formData.startDateTime).toISOString();
      const endDateTimeISO = new Date(formData.endDateTime).toISOString();

      const linesArray = formData.attendees.split("\n");
      const arrayOfObjects = linesArray.map((line) => {
        const [email, content] = line.split(": "); // Split each line into email and content
        return { email, input: content }; // Create an object with email and input properties
      });

      const response = await axios.post(
        "http://localhost:8080/schedule_event",
        {
          summary: formData.summary,
          description: formData.description,
          startDateTime: startDateTimeISO,
          endDateTime: endDateTimeISO,
          location: formData.location,
          attendees: arrayOfObjects,
        }
      );

      console.log(response.data);
      setAlert({ status: "success", message: "Event created successfully" });
      setTimeout(() => {
        setAlert({ status: null, message: "" });
      }, 5000);
    } catch (error) {
      console.error("Error creating event:", error.message);
      setAlert({ status: "error", message: "Error creating event" });
    }
  };



  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${(now.getMonth() + 1)}`.padStart(2, '0'); // Month is 0-indexed
    const day = `${now.getDate()}`.padStart(2, '0');
    const hours = `${now.getHours()}`.padStart(2, '0');
    const minutes = `${now.getMinutes()}`.padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleCloseAlert = () => {
    // Handle close button click
    setAlert({ status: null, message: "" });
  };


  return (
    <Box>
      {alert.status && (
        <Alert status={alert.status} mt={20} display={"flex"} justifyContent={"center"} alignItems={"center"} position="fixed" top={0} left={0} right={0} zIndex={9999} onClose={handleCloseAlert} autoCloseDuration={5000}
         >
          <AlertIcon />
          <Box textAlign="center">{alert.message}</Box>
        </Alert>
      )}
      <Box
        maxW="2xl"
        mx="auto"
        boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px;"}
        padding={"50px"}
        bg={"white"}
        mb={"20px"}
        mt={{sm:"8", md:"16"}}
      >
        <Heading size="lg">Event Form</Heading>
        <Grid gridTemplateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={4} mt={4}>
          <GridItem>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                focusBorderColor="purple.500"
                type="text"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                focusBorderColor="purple.500"
                placeholder="Enter description"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                resize="none"
              />
            </FormControl>
          </GridItem>
        </Grid>

        <Grid gridTemplateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={4} mt={4}>
          <GridItem>
            <FormControl>
              <FormLabel>Start Time</FormLabel>
              <Input
                focusBorderColor="purple.500"
                type="datetime-local"
                name="startDateTime"
                min={getCurrentDateTime()}
                value={formData.startDateTime}
                onChange={handleInputChange}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>End Time</FormLabel>
              <Input
                focusBorderColor="purple.500"
                type="datetime-local"
                name="endDateTime"
                value={formData.endDateTime}
                onChange={handleInputChange}
              />
            </FormControl>
          </GridItem>
        </Grid>

        <Grid gridTemplateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={4} mt={4}>
          <GridItem>
            <FormControl>
              <FormLabel>Location or Zoom link</FormLabel>
              <Input
                focusBorderColor="purple.500"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location"
              />
            </FormControl>
          </GridItem>

          <GridItem>
            {/* <FormControl>
              <FormLabel>Meeting Link</FormLabel>
              <Input focusBorderColor="purple.500" placeholder="Enter meeting link" />
            </FormControl> */}
            <FormControl>
              <FormLabel>Attendees</FormLabel>
              <Textarea
                focusBorderColor="purple.500"
                resize="none"
                placeholder="Enter attendees"
                type="text"
                name="attendees"
                value={formData.attendees}
                onChange={handleInputChange}
              />
            </FormControl>
          </GridItem>
        </Grid>

        

        <Button
          type="button"
          onClick={handleCreateEvent}
          colorScheme="purple"
          mt={4}
        >
          Create Event
        </Button>

        </Box>
    </Box>
  );
};

export default Form;
