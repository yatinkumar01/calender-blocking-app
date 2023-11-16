import { Box, Heading, Text, Button } from "@chakra-ui/react";
import logo from "../google-meet.svg";
import React, { useState } from "react";
import { FiArrowRight } from 'react-icons/fi';
import {IoMdArrowDropdown} from 'react-icons/io'
import {MdArrowRight, MdArrowDropDown} from 'react-icons/md'
import Dropdown from "./Dropdown";

const gridData = [
  { id: 1, title: 'Frontend Developer Meeting', startTime: '12:15 PM', endTime: '12:45 PM', color: 'white',attendies:["rasalaniket00@gmail.com","siddharth@gmail.com","aniket@gmail.com"]},
  { id: 2, title: 'Frontend Developer Meeting', startTime: '12:15 PM', endTime: '12:45 PM', color: 'white',attendies:["prashantjadhav00@gmail.com","siddharth@gmail.com","aniket@gmail.com"] },
  { id: 3, title: 'Frontend Developer Meeting', startTime: '12:15 PM', endTime: '12:45 PM', color: 'white',attendies:["rasalaniket00@gmail.com","siddharth@gmail.com","aniket@gmail.com"] },
  { id: 4, title: 'Frontend Developer Meeting', startTime: '12:15 PM', endTime: '12:45 PM', color: 'white' ,attendies:["rasalaniket00@gmail.com","siddharth@gmail.com","aniket@gmail.com"]},
  { id: 5, title: 'Frontend Developer Meeting', startTime: '12:15 PM', endTime: '12:45 PM', color: 'white',attendies:["rasalaniket00@gmail.com","siddharth@gmail.com","aniket@gmail.com"] },
  // Add more items as needed
];

const Dashboard = () => {
    const [dropdownStates, setDropdownStates] = useState(Array(gridData.length).fill(false));
    const [iconStates, setIconStates] = useState(Array(gridData.length).fill(true));
  
    const handleDropdownToggle = (index) => {
      const updatedStates = [...dropdownStates];
      const updatedIconStates = [...iconStates];
      
      updatedStates[index] = !updatedStates[index];
      updatedIconStates[index] = !updatedIconStates[index];
      
      setDropdownStates(updatedStates);
      setIconStates(updatedIconStates);
    };

  
    return (
      <Box className="dashboard-container">
        <Box className="grid-container">
          {gridData.map((item, index) => (
            <Box
              key={item.id}
              className="grid-item"
              style={{ background: item.color }}
            >
              <Box>
                <Heading size='md'>{item.title}</Heading>
                <Box className="linkbox">
                  <img style={{ width: "20px" }} src={logo} alt="Google Meet Logo" />
                  <br />
                  <a style={{ fontSize: "13px", color: "blue" }} href="https://meet.google.com/iom-wevo-oji">https://meet.google.com/iom-wevo-oji</a>
                </Box>
                <br />
                <Box className="timebox">
                  <Heading size='md'>{item.startTime}</Heading>
                  <Heading size='md'>{<FiArrowRight />}</Heading>
                  <Heading size='md'>{item.endTime}</Heading>
                </Box>
                <Box className="timebox">
                  <Text fontSize='sm' fontWeight={"100"} color='gray'>Sunday, August 16, 2023</Text>
                  <Text fontSize='sm' fontWeight={"100"} color='gray'>Mumbai, India</Text>
                </Box>
                <br />
                <Box className="dropdownBox">
                  <Text fontSize='sm'> Attendees:</Text>
                  <button className="dropdownBtn" onClick={() => handleDropdownToggle(index)}>{iconStates[index] ? <MdArrowRight /> : <MdArrowDropDown />}</button>
                  {dropdownStates[index] && (
                    <Dropdown>
                      <ul style={{ textAlign: 'left', paddingInlineStart: '0' }}>
                        {item.attendies.map((email, emailIndex) => (
                          <li key={emailIndex} style={{ fontSize: "14px" }}>{email}</li>
                        ))}
                      </ul>
                    </Dropdown>
                  )}
                </Box>
                <br />
  
                <Box className="timebox">
                  <Button className="fontbtn" colorScheme='purple' >Edit</Button>
                  <Button className="fontbtn" colorScheme='red' >Delete</Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };
  
  export default Dashboard;
