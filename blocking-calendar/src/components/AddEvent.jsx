import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";

const CreateEventForm = () => {
  const [formData, setFormData] = useState({
    summary: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
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

      const response = await axios.post(
        "http://localhost:8080/schedule_event",
        {
          summary: formData.summary,
          description: formData.description,
          startDateTime: startDateTimeISO,
          endDateTime: endDateTimeISO,
        }
      );
      console.log(response.data); // Log the response from the backend
    } catch (error) {
      console.error("Error creating event:", error.message);
    }
  };

  return (
    <Box>
      <Heading>Create Event Form</Heading>
      <FormControl>
        <FormLabel>Summary:</FormLabel>
        <Input
          type="text"
          name="summary"
          value={formData.summary}
          onChange={handleInputChange}
        />

        <FormLabel>Description:</FormLabel>
        <Input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />

        <FormLabel>Start Date and Time:</FormLabel>
        <Input
          type="datetime-local"
          name="startDateTime"
          value={formData.startDateTime}
          onChange={handleInputChange}
        />

        <FormLabel>End Date and Time:</FormLabel>
        <Input
          type="datetime-local"
          name="endDateTime"
          value={formData.endDateTime}
          onChange={handleInputChange}
        />

        <Button type="button" onClick={handleCreateEvent}>
          Create Event
        </Button>
      </FormControl>
    </Box>
  );
};

export default CreateEventForm;
