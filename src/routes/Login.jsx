import { useState } from "react";
import {
  Button,
  useToast,
  Input,
  Flex,
  Box,
  FormControl,
  InputGroup,
  InputRightElement,
  Image,
} from "@chakra-ui/react";
import axios from "axios";
import logo from "../assets/img/nexus-website-favicon-white.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const apiKey = import.meta.env.VITE_API_KEY;
  const backendUrl = import.meta.env.VITE_BACKEND_URI || "http://localhost:5001";
  const [show, setShow] = useState(false);
  const toast = useToast();

  const handleShow = () => setShow(!show);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${backendUrl}/api/users/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const data = response.data;

      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        e.target.reset();
        toast({
          title: "Login successful.",
          description: "You have successfully logged in.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401 && data?.error === "Incorrect password") {
          toast({
            title: "Incorrect Password.",
            description: "Please check your password and try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else if (status === 404 && data?.error === "User not found") {
          toast({
            title: "User Not Found.",
            description: "Redirecting to Signup...",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
          setTimeout(() => {
            window.location.href = "/signup";
          }, 3000);
        } else {
          toast({
            title: "Login Failed.",
            description: data?.message || "An unexpected error occurred. Check console for details.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else if (error.request) {
        toast({
          title: "Network Error.",
          description: "Unable to connect to the server. Please check your internet connection.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error.",
          description: "Something went wrong. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
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
    <Flex className="flex justify-center items-center h-screen bg-zinc-900">
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
        <Image className="h-20 w-20 mx-auto" src={logo} alt="Logo" />
        <h3 className="text-white text-center mb-5 font-bold">
          Log In with College ID
        </h3>
        <FormControl mb="5">
          <Input
            required
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleInputChange}
            focusBorderColor="teal.800"
          />
        </FormControl>
        <FormControl mb="5">
          <InputGroup size="md">
            <Input
              required
              type={show ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              onChange={handleInputChange}
              focusBorderColor="teal.800"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleShow}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Flex className="flex items-center justify-center space-x-2">
          <Button type="submit" bg="teal.800" color="white" fontWeight="bold">
            Log In
          </Button>
          <Button bg="white" color="teal.800" fontWeight="bold" onClick={() => window.location.href = "/signup"}>
            New User? Sign Up
          </Button>
        </Flex>
        <Flex className="flex items-center justify-center space-x-2">
          <Button bg="white" color="teal.800" fontWeight="bold" my={2} onClick={() => window.location.href = "/forgot-password"}>
            Forgot Password? Reset
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Login;