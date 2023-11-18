import React, { useState } from "react";
import { getCurrentDateTime } from "../utils";
import {
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const UpdateForm = ({
  editModalIsOpen,
  eventData,
  handleEditSubmission,
  closeEditModal,
}) => {
  const [formData, setFormData] = useState({
    summary: eventData && eventData.summary ? eventData.summary : "",
    description: eventData && eventData.summary ? eventData.summary : "",
    startDateTime: eventData && eventData.start ? eventData.start : "",
    endDateTime: eventData && eventData.end ? eventData.end : "",
    location: eventData && eventData.location ? eventData.location : "",
    attendees:
      eventData && eventData.attendees ? eventData.attendees.join("/n") : [],
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
  const handleEditSubmission = async () => {
    try {
      const startDateTimeISO = new Date(formData.startDateTime).toISOString();
      const endDateTimeISO = new Date(formData.endDateTime).toISOString();

      const linesArray = formData.attendees.split("\n");
      const arrayOfObjects = linesArray.map((line) => {
        const [email, content] = line.split(": ");
        return { email, input: content };
      });

      const response = await axios.post(
        "http://localhost:8080/update_event", 
        {
          eventId: eventData.eventId, 
          summary: formData.summary,
          description: formData.description,
          startDateTime: startDateTimeISO,
          endDateTime: endDateTimeISO,
          location: formData.location,
          attendees: arrayOfObjects,
        }
      );

      console.log(response.data); 
      alert("Event updated successfully");
      closeEditModal();
    } catch (error) {
      console.error("Error updating event:", error.message);
      alert("Error updating event");
    }
  };
  return (
    <Modal
      finalFocusRef={finalRef}
      isOpen={editModalIsOpen}
      onClose={closeEditModal}
      size={"xl"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            maxW="xl"
            mx="auto"
            boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px;"}
            padding={"50px"}
            bg={"white"}
          >
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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

            <Grid templateColumns="repeat(2, 48%)" gap={4}>
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

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={closeEditModal}>
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleEditSubmission(item.eventId)}
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateForm;
