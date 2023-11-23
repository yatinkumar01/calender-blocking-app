import React, { useState, useRef } from "react";
import {
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Box,
  Button,
  ModalFooter,
} from "@chakra-ui/react";
import { MdEventBusy } from "react-icons/md";

const UpdateForm2 = ({
  getCurrentDateTime,
  eventData,
  handleUpdateEvent,
  closeEditModal,
}) => {
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
              // type="text"
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
              // type="text"
              name="attendees"
              value={formData.attendees}
              onChange={handleInputChange}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <ModalFooter>
        <Button variant="ghost" mr={3} onClick={closeEditModal}>
          Cancel
        </Button>
        <Button
          colorScheme="purple"
          onClick={() => {
            handleUpdateEvent(eventData.eventId, formData);
          }}
        >
          Save Changes
        </Button>
      </ModalFooter>
    </Box>
  );
};

export default UpdateForm2;
