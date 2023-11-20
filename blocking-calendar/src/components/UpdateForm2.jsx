import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Box,
  Button,
} from "@chakra-ui/react";

const UpdateForm2 = ({ getCurrentDateTime, eventData, closeEditModal,handleUpdateEvent }) => {
  console.log(eventData);

  const [formData, setFormData] = useState({
    summary: eventData && eventData.summary ? eventData.summary : "",
    description: eventData && eventData.summary ? eventData.summary : "",
    startDateTime: eventData && eventData.start ? eventData.start : "",
    endDateTime: eventData && eventData.end ? eventData.end : "",
    location: eventData && eventData.location ? eventData.location : "",
    attendees:
      eventData && eventData.attendees
        ? eventData.attendees.map((attendee) => attendee.email).join("/n")
        : [],
  });

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

  // const handleUpdateEvent = async (eventId) => {
  //   console.log("151", eventId);
  //   try {
  //     // const startDateTimeISO = new Date(formData.startDateTime).toISOString();
  //     // const endDateTimeISO = new Date(formData.endDateTime).toISOString();

  //     const startDateTimeISO = new Date(formData.startDateTime);
  //     const endDateTimeISO = new Date(formData.endDateTime);

  //     console.log("155", eventId);
  //     console.log(formData);

  //     const linesArray = formData.attendees.split("\n");
  //     const arrayOfObjects = linesArray.map((line) => {
  //       const [email, content] = line.split(": "); // Split each line into email and content
  //       return { email, input: content }; // Create an object with email and input properties
  //     });

  //     console.log("163", formData);

  //     const response = await axios.post(
  //       `http://localhost:8080/update-event/${eventId}`,
  //       {
  //         summary: formData.summary,
  //         description: formData.description,
  //         startDateTime: startDateTimeISO,
  //         endDateTime: endDateTimeISO,
  //         location: formData.location,
  //         attendees: arrayOfObjects,
  //       }
  //     );

  //     console.log(response.data); // Log the response from the backend
  //     // events.forEach((element,index) => {
  //     //   if(element.eventId == eventId){
  //     //     element.summary= formData.summary
  //     //     element.description= formData.description
  //     //     element.startDateTime= startDateTimeISO
  //     //     element.endDateTime= endDateTimeISO
  //     //     element.location= formData.location
  //     //     element.attendees= arrayOfObjects
  //     //   }
  //     // });
  //     alert("Event updated successfully");
  //     closeEditModal();
  //     // setAlert({ status: "success", message: "Event updated successfully" });
  //     // setTimeout(() => {
  //     //   setAlert({ status: null, message: "" });
  //     // }, 5000);
  //   } catch (error) {
  //     console.error("Error creating event:", error.message);
  //     alert("Error updated event");
  //     // setAlert({ status: "error", message: "Error updated event" });
  //   }
  // };



  



  return (
    <Box
      maxW="xl"
      mx="auto"
      boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px;"}
      padding={"50px"}
      bg={"white"}
    >
      <Grid
        gridTemplateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
        gap={4}
      >
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
      </Grid>

      <Grid
        gridTemplateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
        gap={4}
      >
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
              min={formData.startDateTime}
              onChange={handleInputChange}
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Grid
        gridTemplateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
        gap={4}
      >
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

        <GridItem>
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

      <Button variant="ghost" mr={3} onClick={closeEditModal}>
        Cancel
      </Button>
      <Button
        colorScheme="purple"
        onClick={() => {
          handleUpdateEvent(eventData.eventId,formData);
        }}
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default UpdateForm2;
