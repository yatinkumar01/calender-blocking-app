import { Box, Heading, Text, Button } from "@chakra-ui/react";
import logo from "../google-meet.svg";
import React, { useState, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import { MdArrowRight, MdArrowDropDown } from "react-icons/md";
import Dropdown from "./Dropdown";
import UpdateForm from "./UpdateForm";

const Dashboard = () => {
  const [events, setEvents] = useState([]);

  const [dropdownStates, setDropdownStates] = useState(
    Array(events.length).fill(false)
  );
  const [iconStates, setIconStates] = useState(Array(events.length).fill(true));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);

  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  const openEditModal = () => setEditModalIsOpen(true);
  const closeEditModal = () => setEditModalIsOpen(false);

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

  const handleEditClick = (eventID) => {
    openEditModal();
  };
  const handleEditSubmission = (eventID) => {};

  const handleDeleteEvent = (event_ID) => {
    fetch(`http://localhost:8080/delete-event/${event_ID}`)
      .then((response) => {
        console.log("deletedddddd");
        const updatedEvents = events.filter((event) => event.eventId !== event_ID);
        setEvents(updatedEvents);
        alert(`${event_ID} Deleted successfully`);
      })
      .catch((error) => {
        console.log("error in delete");
        alert(`${event_ID} not deleted`);
      });
  };

  return (
    <Box className="dashboard-container">
      <Box className="grid-container">
        {events.map((item, index) => (
          <Box key={item.eventId} className="grid-item">
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
                  {iconStates[index] ? <MdArrowRight /> : <MdArrowDropDown />}
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
                  onClick={() => handleEditClick(item.eventId)}
                >
                  Edit
                </Button>
                <UpdateForm
                  editModalIsOpen={editModalIsOpen}
                  eventData={item}
                  handleEditSubmission={handleEditSubmission}
                  closeEditModal={closeEditModal}
                />
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
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;
