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
  AlertIcon,
  Box,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";

import { MdArrowRight, MdArrowDropDown } from "react-icons/md";
import Dropdown from "./Dropdown";
import Form from "./Form";
import UpdateForm2 from "./UpdateForm2";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    summary: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    location: "",
    attendees: [],
  });
  const [dropdownStates, setDropdownStates] = useState(
    Array(events.length).fill(false)
  );
  const [iconStates, setIconStates] = useState(Array(events.length).fill(true));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  const openEditModal = () => setEditModalIsOpen(true);
  const closeEditModal = () => setEditModalIsOpen(false);

  // const [alert, setAlert] = useState({
  //   status: null,
  //   message: "",
  // });

  useEffect(() => {
    // we Replace 'example@gmail.com' with the desired user email in the backend
    const userEmail = "officialsiddharthbisht@gmail.com";

    // Make a GET request to the backend API to fetch events
    fetch(`http://localhost:8080/list-events/${userEmail}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(userEmail);
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

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, "0"); // Month is 0-indexed
    const day = `${now.getDate()}`.padStart(2, "0");
    const hours = `${now.getHours()}`.padStart(2, "0");
    const minutes = `${now.getMinutes()}`.padStart(2, "0");

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

  const handleUpdateEvent = async (eventId, updatedData) => {
    console.log("151", eventId);
    console.log("Ratikanta");
    try {
      // const startDateTimeISO = new Date(formData.startDateTime).toISOString();
      // const endDateTimeISO = new Date(formData.endDateTime).toISOString();

      const startDateTimeISO = new Date(updatedData.startDateTime);
      const endDateTimeISO = new Date(updatedData.endDateTime);

      console.log("155", eventId);
      console.log(formData);

      const linesArray = updatedData.attendees.split("\n");
      const arrayOfObjects = linesArray.map((line) => {
        const [email, content] = line.split(": "); // Split each line into email and content
        return { email, input: content }; // Create an object with email and input properties
      });

      console.log("163", updatedData);

      const response = await axios.post(
        `http://localhost:8080/update-event/${eventId}`,
        {
          summary: updatedData.summary,
          description: updatedData.description,
          startDateTime: startDateTimeISO,
          endDateTime: endDateTimeISO,
          location: updatedData.location,
          attendees: arrayOfObjects,
        }
      );

      console.log(response.data); // Log the response from the backend
      events.forEach((element, index) => {
        console.log("element", 11, updatedData);
        if (element.eventId == eventId) {
          element.summary = updatedData.summary;
          element.description = updatedData.description;
          element.startDateTime = startDateTimeISO;
          element.endDateTime = endDateTimeISO;
          // element.startDateTime= startDateTimeISO
          // element.endDateTime= endDateTimeISO
          element.location = updatedData.location;
          element.attendees = arrayOfObjects;
        }
      });
      setEvents([...events]);
      alert("Event updated successfully");
      closeEditModal();
      // setAlert({ status: "success", message: "Event updated successfully" });
      // setTimeout(() => {
      //   setAlert({ status: null, message: "" });
      // }, 5000);
    } catch (error) {
      console.error("Error creating event:", error.message);
      alert("Error updated event");
      // setAlert({ status: "error", message: "Error updated event" });
    }
  };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    openEditModal();
  };

  const [tem, setTem] = useState();
  const handleDeleteEvent = (event_ID) => {
    fetch(`http://localhost:8080/delete-event/${event_ID}`)
      .then((response) => {
        console.log("deletedddddd");
        setEvents(events.filter((element) => element.eventId !== event_ID));
        console.log("events", events);
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

  const isValidURL = (str) => {
    try {
      new URL(str);
      return true;
    } catch (error) {
      return false;
    }
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
      <Grid
        className="grid-container"
        gridTemplateColumns={{
          sm: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
      >
        {events.map((item, index) => (
          <GridItem key={item.event_ID} className="grid-item">
            <Box w={"90%"} maxW={"300px"}>
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

              {/* box for metting place */}

              <Box>
                {isValidURL(item.location) ? (
                  <a
                    href={item.location}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button colorScheme="blue" size="sm" p={5}>
                      Join with Zoom link
                    </Button>
                  </a>
                ) : (
                  <Text fontSize="sm" fontWeight={"100"} color="gray">
                    {item.location}
                  </Text>
                )}
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
              <Box className="timebox" pb={"1rem"}>
                <Text fontSize="sm" fontWeight={"100"} color="gray">
                  <DateDisplay date={item.start} />
                </Text>
                {/* <Text fontSize="sm" fontWeight={"100"} color="gray">
                  {item.location}
                </Text> */}
              </Box>
              <Box
                display={"flex"}
                justifyContent={"start"}
                maxHeight={{ sm: "40px", md: "40px", lg: "40px" }}
                pb={"1rem"}
                pl={0}
                maxW={"320px"}
              >
                <Text
                  fontSize="sm"
                  fontWeight={"600"}
                  color="black"
                  textAlign={"start"}
                  width={"100%"}
                  maxH={"200px"}
                >
                  Description: {item.description}
                </Text>
              </Box>

              {/* Place for link */}

              <br />
              <Box className="dropdownBox">
                <Text fontSize="sm" mt={6}>
                  {" "}
                  Attendees:
                </Text>
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
                  pl={"40px"}
                  pr={"40px"}
                  onClick={() => handleEditClick(item)}
                >
                  Edit
                </Button>
                <Modal
                  finalFocusRef={finalRef}
                  isOpen={editModalIsOpen}
                  onClose={closeEditModal}
                  size={"xl"}
                >
                  <ModalOverlay
                    bg="blackAlpha.300"
                    // backdropFilter="blur(10px) hue-rotate(90deg)"
                  />
                  <ModalContent>
                    <ModalHeader>Edit Event</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      {selectedEvent && (
                        <UpdateForm2
                          getCurrentDateTime={getCurrentDateTime}
                          eventData={selectedEvent}
                          closeEditModal={closeEditModal}
                          handleUpdateEvent={handleUpdateEvent}
                        />
                      )}

                      {/* <Box
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
                      </Box> */}
                    </ModalBody>

                    <ModalFooter></ModalFooter>
                  </ModalContent>
                </Modal>
                <Button
                  className="fontbtn"
                  colorScheme="red"
                  pl={"30px"}
                  pr={"30px"}
                  onClick={onOpen}
                >
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
