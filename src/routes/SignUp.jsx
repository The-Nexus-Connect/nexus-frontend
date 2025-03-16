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
  Image,
} from "@chakra-ui/react";
import axios from "axios";
import logo from '../assets/img/nexus-website-favicon-white.png';

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

  const handleShow = () => setShow(!show);

  const validatePassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const validateEmail = (email) => {
    return email.endsWith("@kiet.edu");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid Email!",
        description: "Please use your college email ending with @kiet.edu.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (!validatePassword(formData.password)) {
      toast({
        title: "Weak password!",
        description: "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/users/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.accessToken);
        toast({
          title: "Registration successful.",
          description: "Your account has been created.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        window.location.href = "/";
      } else {
        toast({
          title: "Registration failed.",
          description: "Please check your inputs.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
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
    <Flex className="flex justify-center items-center h-screen bg-zinc-900">
      <Box as="form" onSubmit={handleSubmit} w="sm" p="8" bg="black" boxShadow="2xl" rounded="md" method="POST">
        <Image className="h-20 w-20 mx-auto" src={logo} alt="Logo" />
        <h3 className="text-white text-center mb-5 font-bold">Sign Up with College ID</h3>
        <Box>
          <FormControl mb="4">
            <Input required placeholder="Full Name" name="username" onChange={handleInputChange} />
          </FormControl>
          <FormControl mb="4">
            <Input required placeholder="Library ID" name="libId" onChange={handleInputChange} focusBorderColor='teal.800' />
          </FormControl>
          <FormControl mb="4">
            <Input required placeholder="University Roll No." name="rollNo" onChange={handleInputChange} focusBorderColor='teal.800' />
          </FormControl>
          <FormControl mb="4">
            <Input required type="email" placeholder="Email (must be @kiet.edu)" name="email" onChange={handleInputChange} focusBorderColor='teal.800' />
          </FormControl>
          <FormControl mb="4">
            <InputGroup size='md'>
              <Input required type={show ? 'text' : 'password'} name='password' placeholder='Enter password' onChange={handleInputChange} focusBorderColor='teal.800' />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleShow}>{show ? 'Hide' : 'Show'}</Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Flex mb="4" className="space-x-2">
            <Select required name="branch" onChange={handleInputChange} focusBorderColor='teal.800'>
              <option style={{ background: 'black' }} value="">Select Branch</option>
              <option style={{ background: 'black' }} value="CSE">CSE</option>
              <option style={{ background: 'black' }} value="CSE(AI)">CSE(AI)</option>
              <option style={{ background: 'black' }} value="CSE(AIML)">CSE(AIML)</option>
              <option style={{ background: 'black' }} value="CS">CS</option>
              <option style={{ background: 'black' }} value="CSIT">CSIT</option>
              <option style={{ background: 'black' }} value="IT">IT</option>
              <option style={{ background: 'black' }} value="ECE">ECE</option>
              <option style={{ background: 'black' }} value="ELCE">ELCE</option>
              <option style={{ background: 'black' }} value="EEE">EEE</option>
              <option style={{ background: 'black' }} value="ME">ME</option>
            </Select>
            <Select required name="section" onChange={handleInputChange} focusBorderColor='teal.800'>
              <option style={{ background: 'black' }} value="">Select Section</option>
              <option style={{ background: 'black' }} value="A">A</option>
              <option style={{ background: 'black' }} value="B">B</option>
              <option style={{ background: 'black' }} value="C">C</option>
              <option style={{ background: 'black' }} value="D">D</option>
              <option style={{ background: 'black' }} value="E">E</option>
            </Select>
          </Flex>
          <Flex className="flex items-center justify-center space-x-2">
            <Button type="submit" bg="teal.800" color="white" fontWeight="bold">Sign Up</Button>
            <Button bg="white" color="teal.800" fontWeight="bold" onClick={() => window.location.href = "/login"}>Already a User? Log In</Button>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default SignUp;