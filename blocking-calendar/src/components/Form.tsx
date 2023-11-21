import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Heading,
  Box,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Alert,
  AlertIcon,
  Tag,
  TagLabel,
  TagCloseButton,
  VStack,
  HStack,
} from "@chakra-ui/react";

const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0"); // Month is 0-indexed
  const day = `${now.getDate()}`.padStart(2, "0");
  const hours = `${now.getHours()}`.padStart(2, "0");
  const minutes = `${now.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const Form = () => {
  const [alert, setAlert] = useState({
    status: null,
    message: "",
  });

  const handleCreateEvent = async () => {
    try {
      const startDateTimeISO = new Date(
        formik.values.startDateTime
      ).toISOString();
      const endDateTimeISO = new Date(formik.values.endDateTime).toISOString();

      const linesArray = formik.values.attendees.split("\n");
      const arrayOfObjects = linesArray.map((line) => {
        const [email, content] = line.split(": "); // Split each line into email and content
        return { email, input: content }; // Create an object with email and input properties
      });

      const response = await axios.post(
        "http://localhost:8080/schedule_event",
        {
          summary: formik.values.summary,
          description: formik.values.description,
          startDateTime: startDateTimeISO,
          endDateTime: endDateTimeISO,
          location: formik.values.location,
          attendees: arrayOfObjects,
        }
      );

      console.log(response.data);
      formik.resetForm();
      setAlert({
        status: "success",
        message: "Event created successfully",
      });
      setTimeout(() => {
        setAlert({ status: null, message: "" });
      }, 5000);
    } catch (error) {
      console.error("Error creating event:", error.message);
      setAlert({ status: "error", message: "Error creating event" });
    }
  };

  const validationSchema = Yup.object().shape({
    summary: Yup.string().required("Title is required"),
    location: Yup.string().required("Location is required"),
    startDateTime: Yup.string().required("Start Time is required"),
    endDateTime: Yup.string().required("End Time is required"),
    attendees: Yup.string().required("Attendees are required"),
  });

  const formik = useFormik({
    initialValues: {
      summary: "",
      description: "",
      startDateTime: "",
      endDateTime: "",
      location: "",
      attendees: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleCreateEvent,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "startDateTime" &&
      new Date(value) > new Date(formik.values.endDateTime)
    ) {
      formik.setValues({
        ...formik.values,
        endDateTime: value,
        [name]: value,
      });
    } else if (
      name === "endDateTime" &&
      new Date(value) < new Date(formik.values.startDateTime)
    ) {
      formik.setValues({
        ...formik.values,
        startDateTime: value,
        [name]: value,
      });
    } else if (name === "startDateTime") {
      formik.setValues({
        ...formik.values,
        [name]: value,
      });
    } else {
      formik.setValues({
        ...formik.values,
        [name]: value,
      });
    }
  };

  const handleCloseTag = (index) => {
    const newAttendees = [...formik.values.attendees.split("\n")];
    newAttendees.splice(index, 1);
    formik.setValues({
      ...formik.values,
      attendees: newAttendees.join("\n"),
    });
  };

  const renderAttendeeTags = () => {
    const attendeesArray = formik.values.attendees.split("\n");
    return attendeesArray.map((attendee, index) => (
      <Tag
        size="sm"
        key={index}
        borderRadius="full"
        variant="solid"
        colorScheme="green"
      >
        <TagLabel>{attendee}</TagLabel>
        <TagCloseButton onClick={() => handleCloseTag(index)} />
      </Tag>
    ));
  };

  const handleCloseAlert = () => {
    setAlert({ status: null, message: "" });
  };

  return (
    <Box>
      {alert.status && (
        <Alert
          status={alert.status}
          mt={20}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          position="fixed"
          top={0}
          left={0}
          right={0}
          zIndex={9999}
          // onClose={handleCloseAlert}
          // onCloseComplete={handleCloseAlert}
          // autoCloseDuration={5000}
        >
          <AlertIcon />
          <Box textAlign="center">{alert.message}</Box>
        </Alert>
      )}
      <Box
        maxW="2xl"
        mx="auto"
        boxShadow={"rgba(56, 128, 135, 0.54) 0px 3px 8px"}
        padding={"50px"}
        bg={"white"}
        mb={"20px"}
        mt={{ sm: "8", md: "16" }}
      >
        <Heading size="lg">Event Form</Heading>
        <form onSubmit={formik.handleSubmit}>
          <Grid
            gridTemplateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
            gap={4}
            mt={4}
          >
            <GridItem>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  // //focusBorderColor="purple.500"
                  //type="text"
                  name="summary"
                  value={formik.values.summary}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Location or Zoom link</FormLabel>
                <Input
                  //focusBorderColor="purple.500"
                  //type="text"
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter location"
                  required
                />
              </FormControl>
            </GridItem>
          </Grid>

          <Grid
            gridTemplateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
            gap={4}
            mt={4}
          >
            <GridItem>
              <FormControl isRequired>
                <FormLabel>Start Time</FormLabel>
                <Input
                  //focusBorderColor="purple.500"
                  type="datetime-local"
                  name="startDateTime"
                  min={getCurrentDateTime()}
                  value={formik.values.startDateTime}
                  onChange={handleInputChange}
                  onBlur={formik.handleBlur}
                  required
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>End Time</FormLabel>
                <Input
                  //focusBorderColor="purple.500"
                  type="datetime-local"
                  name="endDateTime"
                  value={formik.values.endDateTime}
                  onChange={handleInputChange}
                  onBlur={formik.handleBlur}
                  required
                />
              </FormControl>
            </GridItem>
          </Grid>

          <Grid
            gridTemplateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
            gap={4}
            mt={4}
          >
            <GridItem>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  //focusBorderColor="purple.500"
                  placeholder="Enter description"
                  //type="text"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  resize="none"
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>Attendees</FormLabel>
                <Box
                  border={"2px solid grey"}
                  //focusBorderColor="purple.500"
                  p={1}
                  borderRadius={"8px"}
                >
                  <Textarea
                    //focusBorderColor="white"
                    resize="none"
                    placeholder="Enter attendees"
                    //type="text"
                    name="attendees"
                    border={"none"}
                    value={formik.values.attendees}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />

                  <HStack flex={1} flexWrap={"wrap"}>
                    <VStack
                      w={"100%"}
                      flex={0}
                      justifyContent={"flex-start"}
                      mt={2}
                    >
                      {renderAttendeeTags()}
                    </VStack>
                  </HStack>
                </Box>
              </FormControl>
            </GridItem>
          </Grid>

          <Button
            //type="submit"
            colorScheme="purple"
            mt={4}
            disabled={!formik.isValid}
          >
            Create Event
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Form;
