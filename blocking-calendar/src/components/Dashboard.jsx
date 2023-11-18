import { Box, Heading, Text, Button } from "@chakra-ui/react";
import logo from "../google-meet.svg";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiArrowRight } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Alert,
  AlertIcon

} from "@chakra-ui/react";

import { MdArrowRight, MdArrowDropDown } from "react-icons/md";
import Dropdown from "./Dropdown";
import Form from "./Form";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    summary: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    location:"",
    attendees: [],
  });
  const [dropdownStates, setDropdownStates] = useState(
    Array(events.length).fill(false)
  );
  const [iconStates, setIconStates] = useState(Array(events.length).fill(true));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);

  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  const openEditModal = () => setEditModalIsOpen(true);
  const closeEditModal = () => setEditModalIsOpen(false);

  // const [alert, setAlert] = useState({
  //   status: null,
  //   message: "",
  // });

  useEffect(() => {
    // Replace 'rasalaniket00@gmail.com' with the desired user email
    const userEmail = "rasalaniket00@gmail.com";

    // Make a GET request to the backend API to fetch events
    fetch(`http://localhost:8080/list-events/${userEmail}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Events:", data);
        setEvents(data || []); // Ensure that data.items is defined, otherwise use an empty array
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const handleDropdownToggle = (index) => {
    const updatedStates = [...dropdownStates];
    const updatedIconStates = [...iconStates];

    updatedStates[index] = !updatedStates[index];
    updatedIconStates[index] = !updatedIconStates[index];

    setDropdownStates(updatedStates);
    setIconStates(updatedIconStates);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDateTime' && new Date(value) > new Date(formData.endDateTime)) {
      setFormData({
        ...formData,
        endDateTime: value,
        [name]: value,
      });
    } else if (name === 'endDateTime' && new Date(value) < new Date(formData.startDateTime)) {
      // Ensure endDateTime is not smaller than startDateTime
      setFormData({
        ...formData,
        startDateTime: value,
        [name]: value,
      });
    } else if (name === 'startDateTime') {
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

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${(now.getMonth() + 1)}`.padStart(2, '0'); // Month is 0-indexed
    const day = `${now.getDate()}`.padStart(2, '0');
    const hours = `${now.getHours()}`.padStart(2, '0');
    const minutes = `${now.getMinutes()}`.padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };


  const TimeDisplay = ({ time }) => {
    const parsedDate = new Date(time);
    const formattedTime = parsedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div>
        <p>{formattedTime}</p>
      </div>
    );
  };

  const DateDisplay = ({ date }) => {
    // Parse the input datetime string
    const parsedDate = new Date(date);

    // Format date as "dd MMM yyyy"
    const formattedDate = parsedDate.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return (
      <div>
        <p>{formattedDate}</p>
      </div>
    );
  };

  const handleUpdateEvent = async (eventId) => {
    console.log("151", eventId)
    try {
      const startDateTimeISO = new Date(formData.startDateTime).toISOString();
      const endDateTimeISO = new Date(formData.endDateTime).toISOString();

      console.log("155", eventId)

      const linesArray = formData.attendees.split('\n');
      const arrayOfObjects = linesArray.map(line => {
        const [email, content] = line.split(': '); // Split each line into email and content
        return { email, input: content }; // Create an object with email and input properties
      });

      console.log("163", formData)

      const response = await axios.post(`http://localhost:8080/update-event/${eventId}`, {
        summary: formData.summary,
        description: formData.description,
        startDateTime: startDateTimeISO,
        endDateTime: endDateTimeISO,
        location: formData.location,
        attendees: arrayOfObjects,
      });

      console.log(response.data); // Log the response from the backend
      alert("Event updated successfully")
      closeEditModal();
      // setAlert({ status: "success", message: "Event updated successfully" });
      // setTimeout(() => {
      //   setAlert({ status: null, message: "" });
      // }, 5000);
    } catch (error) {
      console.error('Error creating event:', error.message);
      alert("Error updated event")
      // setAlert({ status: "error", message: "Error updated event" });
    }
  };

  const handleEditClick = (eventId) => {
    openEditModal();
  };


  const handleDeleteEvent = (event_ID) => {
    fetch(`http://localhost:8080/delete-event/${event_ID}`)
      .then((response) => {
        console.log("deletedddddd");
        alert(`${event_ID} Deleted successfully`);
        onClose();
        // setAlert({ status: "success", message: `$Event ID:-{event_ID} deleted successfully` });
      // setTimeout(() => {
      //   setAlert({ status: null, message: "" });
      // }, 5000);
      })
      .catch((error) => {
        console.log("error indelete");
        alert(`${event_ID} not deleted`);
        // setAlert({ status: "error", message: `$Event Id:-{event_ID} not deleted` });
      });
  };

  const handleCloseAlert = () => {
    // Handle close button click
    // setAlert({ status: null, message: "" });
  };

  return (
    <Box className="dashboard-container">
      {/* {alert.status && (
        <Alert status={alert.status} mt={2} display={"flex"} justifyContent={"center"} alignItems={"center"} position="fixed" top={0} left={0} right={0} zIndex={9999} onClose={handleCloseAlert}
         >
          <AlertIcon />
          <Box textAlign="center">{alert.message}</Box>
        </Alert>
      )} */}
      <Grid className="grid-container" gridTemplateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg:"repeat(3, 1fr)" }} >
        {events.map((item, index) => (
          <GridItem key={item.event_ID} className="grid-item">
            <Box>
              <Heading size="md">{item.summary}</Heading>
              <Box className="linkbox">
                <img
                  style={{ width: "20px" }}
                  src={logo}
                  alt="Google Meet Logo"
                />
                <br />
                <a
                  style={{ fontSize: "13px", color: "blue" }}
                  href={`https://meet.google.com/${item.meetLink.conferenceId}`}
                >
                  <Text>{item.meetLink.conferenceId}</Text>
                </a>
              </Box>
              <br />
              <Box className="timebox">
                <Heading size="md">
                  <TimeDisplay time={item.start} />
                </Heading>
                <Heading size="md">{<FiArrowRight />}</Heading>
                <Heading size="md">
                  <TimeDisplay time={item.end} />
                </Heading>
              </Box>
              <Box className="timebox">
                <Text fontSize="sm" fontWeight={"100"} color="gray">
                  <DateDisplay date={item.start} />
                </Text>
                <Text fontSize="sm" fontWeight={"100"} color="gray">
                  {item.location}
                </Text>
              </Box>
              <br />
              <Box className="dropdownBox">
                <Text fontSize="sm"> Attendees:</Text>
                <button
                  className="dropdownBtn"
                  onClick={() => handleDropdownToggle(index)}
                >
                  {iconStates[index] ? <MdArrowDropDown /> : <MdArrowRight />}
                </button>
                {dropdownStates[index] && (
                  <Dropdown>
                    <ul style={{ textAlign: "left", paddingInlineStart: "0" }}>
                      {item.attendees.map((email, emailIndex) => (
                        <li key={emailIndex} style={{ fontSize: "14px" }}>
                          {email.email}
                        </li>
                      ))}
                    </ul>
                  </Dropdown>
                )}
              </Box>
              <br />

              <Box className="timebox">
                <Button
                  className="fontbtn"
                  colorScheme="purple"
                  onClick={() => handleEditClick(item.event_ID)}
                >
                  Edit
                </Button>
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

                        <Grid gridTemplateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={4}>
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

                        <Grid gridTemplateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={4}>
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

                        <Grid gridTemplateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={4}>
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
                        onClick={() => {
                          handleUpdateEvent(item.eventId);
                        }}
                      >
                        Save Changes
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <Button className="fontbtn" colorScheme="red" onClick={onOpen}>
                  Delete
                </Button>
                <Modal
                  finalFocusRef={finalRef}
                  isOpen={isOpen}
                  onClose={onClose}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Delete Event</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Text>Are you sure, you want to delete this event</Text>
                    </ModalBody>

                    <ModalFooter>
                      <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          handleDeleteEvent(item.eventId);
                        }}
                        colorScheme="red"
                      >
                        Delete
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Box>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
