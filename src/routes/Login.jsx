import { useState } from "react";
import { Button, useToast, Input, Flex, Box, FormControl, InputGroup, InputRightElement } from "@chakra-ui/react";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const apiKey = import.meta.env.VITE_API_KEY;
  const backendUrl = import.meta.env.VITE_BACKEND_URI || "http://localhost:5001";
  const [token, setToken] = useState("");
  const [show, setShow] = useState(false);
  const toast = useToast();

  const handleShow = () => setShow(!show)

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${backendUrl}/api/users/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          },
        });

      const data = response.data;
      console.log(data);

      if (data.accessToken) {
        setToken(data.accessToken);
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
      } else {
        toast({
          title: "Login failed.",
          description: "Please check your credentials.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Login failed: " + error);
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
        <h3 className="text-white text-center mb-5">Log In with College ID</h3>
        <FormControl mb="5">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleInputChange}
            focusBorderColor='teal.800'
          />
        </FormControl>
        <FormControl mb="5">
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
            Log In
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
              window.location.href = "/signup";
            }}
          >
            Sign Up
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Login;
