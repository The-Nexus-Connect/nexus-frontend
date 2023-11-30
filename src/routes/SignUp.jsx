import { useState } from "react";
import {
  Button,
  useToast,
  Box,
  Flex,
  FormControl,
  Input,
  Select,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    libId: "",
    email: "",
    password: "",
    branch: "",
    rollNo: "",
    section: "",
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URI || "http://localhost:5001";
  const apiKey = import.meta.env.VITE_API_KEY;
  const [show, setShow] = useState(false);
  const toast = useToast();

  const handleShow = () => setShow(!show)


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${backendUrl}/api/users/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.accessToken);
        e.target.reset();
        toast({
          title: "Registration successful.",
          description: "Your account has been created.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        window.location.href = "/";
      } else {
        console.error("Registration failed");
        toast({
          title: "Registration failed.",
          description: "Please check your inputs.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "An error occurred.",
        description: "Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Flex className="flex justify-center items-center h-screen bg-zinc-900" >
      <Box
        as="form"
        onSubmit={handleSubmit}
        w="sm"
        p="8"
        bg="black"
        boxShadow="2xl"
        rounded="md"
        method="POST"
      >
        <h3 className="text-white text-center mb-5">Sign Up with College ID</h3>
        <Box mb="5">
          <FormControl mb="4">
            <Input
              placeholder="Full Name"
              name="username"
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mb="4">
            <Input
              placeholder="Library ID"
              name="libId"
              onChange={handleInputChange}
              focusBorderColor='teal.800'
            />
          </FormControl>
          <FormControl mb="4">
            <Input
              placeholder="University Roll No."
              name="rollNo"
              onChange={handleInputChange}
              focusBorderColor='teal.800'
            />
          </FormControl>
          <FormControl mb="4">
            <Input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              focusBorderColor='teal.800'
            />
          </FormControl>
          <FormControl mb="4">
            <InputGroup size='md'>
              <Input
                type={show ? 'text' : 'password'}
                name='password'
                placeholder='Enter password'
                onChange={handleInputChange}
                focusBorderColor='teal.800'
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleShow}>
                  {show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Flex mb="4" className="space-x-2">
            <Select
              placeholder="Select Branch"
              name="branch"
              onChange={handleInputChange}
              focusBorderColor='teal.800'
            >
              <option value="CSE(AI)">CSE(AI)</option>
              <option value="CSE(AIML)">CSE(AIML)</option>
            </Select>
            <Select
              placeholder="Select Section"
              name="section"
              onChange={handleInputChange}
              focusBorderColor='teal.800'
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </Select>
          </Flex>
          <Flex className="flex items-center justify-center space-x-2">
            <Button
              type="submit"
              bg="teal.800"
              _hover={{ bg: "teal.700" }}
              color="white"
              fontWeight="bold"
              py={2}
              px={4}
              rounded="md"
              _focus={{ outline: "none", shadow: "outline" }}
            >
              Sign Up
            </Button>
            <Button
              bg="white"
              color="teal.800"
              fontWeight="bold"
              py={2}
              px={4}
              rounded="md"
              _focus={{ outline: "none", shadow: "outline" }}
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Log In
            </Button>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default SignUp;
