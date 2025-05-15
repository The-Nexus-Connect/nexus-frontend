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
  FormErrorMessage,
} from "@chakra-ui/react";
import axios from "axios";
import logo from "../assets/img/nexus-website-favicon-white.png";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    libId: "",
    email: "",
    password: "",
    branch: "",
    rollNo: "",
    section: "",
    yearOfStudy: "", 
  });

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URI || "http://localhost:5001";
  const apiKey = import.meta.env.VITE_API_KEY;
  const toast = useToast();

  const handleShow = () => setShow(!show);

  // Password Validation Function
  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    if (!/[@$!%*?&]/.test(password)) return "Password must contain at least one special character.";
    return "";
  };

  const validateEmail = (email) => email.endsWith("@kiet.edu");

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    setError(validatePassword(newPassword));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    if (error) {
      toast({
        title: "Weak Password!",
        description: error,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setLoading(true); // Disable button

    try {
      const response = await axios.post(`${backendUrl}/api/users/register`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });

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
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Assuming 409 is the status code for "User already exists"
        toast({
          title: "User already exists!",
          description: "Please login with your existing account.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        toast({
          title: "An error occurred.",
          description: "Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false); // Enable button after response
    }
  };

  return (
    <Flex
      className="flex justify-center items-center bg-zinc-900"
      minHeight="100vh" 
      overflowY="auto" 
    >
      <Box
        as="form"
        onSubmit={handleSubmit}
        w="sm"
        p="8"
        bg="black"
        boxShadow="2xl"
        rounded="md"
        method="POST"
        my="8" 
      >
        <Image className="h-20 w-20 mx-auto" src={logo} alt="Logo" />
        <h3 className="text-white text-center mb-5 font-bold">Sign Up with College ID</h3>

        <FormControl mb="4">
          <Input required placeholder="Full Name" name="username" onChange={handleInputChange} />
        </FormControl>

        <FormControl mb="4">
          <Input required placeholder="Library ID" name="libId" onChange={handleInputChange} focusBorderColor="teal.800" />
        </FormControl>

        <FormControl mb="4">
          <Input required placeholder="University Roll No." name="rollNo" onChange={handleInputChange} focusBorderColor="teal.800" />
        </FormControl>

        <FormControl mb="4">
          <Input required type="email" placeholder="Email (must be @kiet.edu)" name="email" onChange={handleInputChange} focusBorderColor="teal.800" />
        </FormControl>

        {/* Password Field with Validation */}
        <FormControl mb="4" isInvalid={!!error}>
          <InputGroup size="md">
            <Input
              required
              type={show ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handlePasswordChange}
              focusBorderColor="teal.800"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleShow}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>

        {/* Branch & Section Selection */}
        <Flex mb="4" className="space-x-2">
          <Select required name="branch" onChange={handleInputChange} focusBorderColor="teal.800">
            <option style={{ background: "black" }} value="">Select Branch</option>
            <option style={{ background: "black" }} value="CSE">CSE</option>
            <option style={{ background: "black" }} value="CSE(AI)">CSE(AI)</option>
            <option style={{ background: "black" }} value="CSE(AIML)">CSE(AIML)</option>
            <option style={{ background: "black" }} value="CS">CS</option>
            <option style={{ background: "black" }} value="CSIT">CSIT</option>
            <option style={{ background: "black" }} value="IT">IT</option>
            <option style={{ background: "black" }} value="ECE">ECE</option>
            <option style={{ background: "black" }} value="ELCE">ELCE</option>
            <option style={{ background: "black" }} value="EEE">EEE</option>
            <option style={{ background: "black" }} value="ME">ME</option>
          </Select>

          <Select required name="section" onChange={handleInputChange} focusBorderColor="teal.800">
            <option style={{ background: "black" }} value="">Select Section</option>
            <option style={{ background: "black" }} value="A">A</option>
            <option style={{ background: "black" }} value="B">B</option>
            <option style={{ background: "black" }} value="C">C</option>
            <option style={{ background: "black" }} value="D">D</option>
            <option style={{ background: "black" }} value="E">E</option>
          </Select>
        </Flex>

        {/* Year of Study Selection */}
        <FormControl mb="4">
          <Select required name="yearOfStudy" onChange={handleInputChange} focusBorderColor="teal.800">
            <option style={{ background: "black" }} value="">Select Year of Study</option>
            <option style={{ background: "black" }} value="1">1st Year</option>
            <option style={{ background: "black" }} value="2">2nd Year</option>
            <option style={{ background: "black" }} value="3">3rd Year</option>
            <option style={{ background: "black" }} value="4">4th Year</option>
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Flex className="flex items-center justify-center space-x-2">
          <Button type="submit" bg="teal.800" color="white" fontWeight="bold" isDisabled={loading || !!error} isLoading={loading}>
            Sign Up
          </Button>
          <Button bg="white" color="teal.800" fontWeight="bold" onClick={() => window.location.href = "/login"}>
            Already a User? Log In
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SignUp;