// Dashboard.jsx
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import logo from "../google-meet.svg";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiArrowRight } from "react-icons/fi";
import { MdArrowRight, MdArrowDropDown } from "react-icons/md";
import { useDisclosure, Grid, GridItem } from "@chakra-ui/react";
import EditEvent from "./EditEvent";
import DeleteEvent from "./DeleteEvent";
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
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [iconStates, setIconStates] = useState(Array(events.length).fill(true));
  
    const { isOpen, onOpen, onClose } = useDisclosure();
    const finalRef = React.useRef(null);
  
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  
    const openEditModal = () => setEditModalIsOpen(true);
    const closeEditModal = () => setEditModalIsOpen(false);
  
    useEffect(() => {
      // Replace 'rasalaniket00@gmail.com' with the desired user email
      const userEmail = "example@gmail.com";
  
      // Make a GET request to the backend API to fetch events
      fetch(`http://localhost:8080/list-events/${userEmail}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Events:", data);
      setEvents(data || []); // Update the state with the fetched data
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
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
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
    
      // Format date as "dd-mm-yyyy --:--"
      return `${day}-${month}-${year} ${hours}:${minutes}`;
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
        alert("Event updated successfully");
        closeEditModal();
      } catch (error) {
        console.error('Error creating event:', error.message);
        alert("Error updated event");
      }
    };

      
        const handleEditClick = (eventId) => {
          // Find the selected event by eventId
          const selectedEventData = events.find((event) => event.eventID === eventId);
      
          // Log to check if selectedEventData is correct
          console.log("Selected Event Data:", selectedEventData);
      
          // Set the selected event data to the state variable
          setSelectedEvent(selectedEventData);
      
          // Set the initial state of formData with selected event data
          setFormData({
            summary: selectedEventData.summary,
            description: selectedEventData.description,
            startDateTime: selectedEventData.start,
            endDateTime: selectedEventData.end,
            location: selectedEventData.location,
            attendees: selectedEventData.attendees.map((attendee) => `${attendee.email}`).join('\n'),
          });
      
          // Open the edit modal
          openEditModal();
        };
  
  
    const handleDeleteEvent = (event_ID) => {
      fetch(`http://localhost:8080/delete-event/${event_ID}`)
        .then((response) => {
          console.log("deletedddddd");
          alert(`${event_ID} Deleted successfully`);
          onClose();
        })
        .catch((error) => {
          console.log("error indelete");
          alert(`${event_ID} not deleted`);
        });
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
       <Grid className="grid-container" gridTemplateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}>
        {events.map((item, index) => (
          <GridItem key={item.eventId} className="grid-item">
            <Box w={"95%"} >
                <GridItem h={{sm:"50px",md:"50px",lg:"70px"}} >
                <Heading  size="md">{item.summary}</Heading>
                </GridItem>
              
              <Box className="linkbox"  >
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
              <Box  pb={"1.5rem"}>
              {isValidURL(item.location) ? (
    <a href={item.location} target="_blank" rel="noopener noreferrer">
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
              <Box className="timebox" >
                <Heading size="md">
                  <TimeDisplay time={item.start} />
                </Heading>
                <Heading size="md">{<FiArrowRight />}</Heading>
                <Heading size="md">
                  <TimeDisplay time={item.end} />
                </Heading>
              </Box>
              <Box className="timebox"  pb={"1rem"}>
                <Text fontSize="sm" fontWeight={"100"} color="gray">
                  <DateDisplay date={item.start} />
                </Text>
              </Box>
              <Box display={"flex"} border={"1px solid black"} justifyContent={"start"} h={{sm:"40px",md:"40px",lg:"40px"}}  pb={"3rem"} pl={0}>
              <Text fontSize="sm" fontWeight={"600"} color="black" textAlign={"start"}>
                Description:  {item.description}
              </Text>

              </Box>
              <Box className="dropdownBox">
                <Text fontSize="sm"> Attendees:</Text>
                <button
                  className="dropdownBtn"
                  onClick={() => handleDropdownToggle(index)}
                >
                  {iconStates[index] ? <MdArrowDropDown /> : <MdArrowRight /> }
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
                <EditEvent
                    item={item}
                  isOpen={editModalIsOpen}
                  onClose={closeEditModal}
                  handleInputChange={handleInputChange}
                  handleUpdateEvent={handleUpdateEvent}
                />
                <Button className="fontbtn" colorScheme="red" onClick={onOpen}>
                  Delete
                </Button>
                <DeleteEvent
                  isOpen={isOpen}
                  onClose={onClose}
                  handleDeleteEvent={handleDeleteEvent}
                  item={item}
                />
              </Box>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
