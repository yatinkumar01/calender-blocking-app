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
} from "@chakra-ui/react";

const Form = () => {
  const [formData, setFormData] = useState({
    summary: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    attendees: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateEvent = async () => {
    try {
      const startDateTimeISO = new Date(formData.startDateTime).toISOString();
      const endDateTimeISO = new Date(formData.endDateTime).toISOString();

      const linesArray = formData.attendees.split('\n');
      const arrayOfObjects = linesArray.map(line => {
        const [email, content] = line.split(': '); // Split each line into email and content
        return { email, input: content }; // Create an object with email and input properties
      });

      const response = await axios.post('http://localhost:8080/schedule_event', {
        summary: formData.summary,
        description: formData.description,
        startDateTime: startDateTimeISO,
        endDateTime: endDateTimeISO,
        attendees: arrayOfObjects,
      });

      console.log(response.data); // Log the response from the backend
      alert("Event created successfully");
    } catch (error) {
      console.error('Error creating event:', error.message);
      alert("Error creating event");
    }
  };

  return (
    <Box>
      <Box
        maxW="2xl"
        mx="auto"
        boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px;"}
        padding={"50px"}
        bg={"white"}
        mb={"20px"}
        mt={8}
      >
        <Heading size="lg">Event Form</Heading>
        <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
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
              />
            </FormControl>
          </GridItem>
        </Grid>

        <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
          <GridItem>
            <FormControl>
              <FormLabel>Start Time</FormLabel>
              <Input
                focusBorderColor="purple.500"
                type="datetime-local"
                name="startDateTime"
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

        <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
          <GridItem>
            <FormControl>
              <FormLabel>Location or Zoom link</FormLabel>
              <Input focusBorderColor="purple.500" placeholder="Enter location" />
            </FormControl>
          </GridItem>

          <GridItem>
            {/* <FormControl>
              <FormLabel>Meeting Link</FormLabel>
              <Input focusBorderColor="purple.500" placeholder="Enter meeting link" />
            </FormControl> */}
            <FormControl>
          <FormLabel>Attendees</FormLabel>
          <Textarea focusBorderColor="purple.500" resize='none' placeholder="Enter attendees" type="text" name="attendees" value={formData.attendees} onChange={handleInputChange} />
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
