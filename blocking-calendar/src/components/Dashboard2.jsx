import React, { useState, useEffect } from "react";

const gridData = [
    { id: 1, title: 'Frontend Developer Meeting', startTime: '12:15 PM', endTime: '12:45 PM', color: 'white',attendies:["rasalaniket00@gmail.com","siddharth@gmail.com","aniket@gmail.com"]},
    { id: 2, title: 'Frontend Developer Meeting', startTime: '12:15 PM', endTime: '12:45 PM', color: 'white',attendies:["prashantjadhav00@gmail.com","siddharth@gmail.com","aniket@gmail.com"] },
    { id: 3, title: 'Frontend Developer Meeting', startTime: '12:15 PM', endTime: '12:45 PM', color: 'white',attendies:["rasalaniket00@gmail.com","siddharth@gmail.com","aniket@gmail.com"] },
    { id: 4, title: 'Frontend Developer Meeting', startTime: '12:15 PM', endTime: '12:45 PM', color: 'white' ,attendies:["rasalaniket00@gmail.com","siddharth@gmail.com","aniket@gmail.com"]},
    { id: 5, title: 'Frontend Developer Meeting', startTime: '12:15 PM', endTime: '12:45 PM', color: 'white',attendies:["rasalaniket00@gmail.com","siddharth@gmail.com","aniket@gmail.com"] },
    // Add more items as needed
  ];

const Dashboard2 = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Replace 'rasalaniket00@gmail.com' with the desired user email
    const userEmail = 'rasalaniket00@gmail.com';

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/list-events/${userEmail}`);
        const data = await response.json();

        console.log('Events:', data);

        // Use the spread operator to append new data to existing events
        setEvents(prevEvents => [...prevEvents, ...(data || [])]);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    // Fetch data initially
    fetchData();

    // Fetch data every 5 seconds (adjust the interval as needed)
    // const intervalId = setInterval(fetchData, 5000);

    // Clean up the interval on component unmount
    
  }, []);

  return (
    <div>
        <h1>Dashboard2</h1>
      {/* Render your events as needed */}
      {events.map((event, index) => (
        <div key={event.event_ID}>
          {/* Render event details */}
          <p>{event.summary}</p>
          {/* ... other details */}
        </div>
      ))}
    </div>
  );
};

export default Dashboard2;
