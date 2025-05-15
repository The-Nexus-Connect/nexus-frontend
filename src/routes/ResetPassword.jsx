import { useState } from "react";
import axios from "axios";
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
  FormErrorMessage,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/img/nexus-website-favicon-white.png";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const toast = useToast();
  const backendUrl = import.meta.env.VITE_BACKEND_URI || "http://localhost:5001";

  const handleShow = () => setShow(!show);

  // Strong password validation
  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    if (!/[@$!%*?&]/.test(password)) return "Password must contain at least one special character.";
    return "";
  };

  const handleChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setError(validatePassword(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast({
        title: "Error",
        description: "Invalid reset token.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/users/reset-password/${token}`, { password });
      
      toast({
        title: "Success",
        description: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setTimeout(() => navigate("/login"), 2000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
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
        <Image className="h-20 w-20 mx-auto justify-center" src={logo} alt="Logo" />
        <h3 className="text-white text-center mb-5 font-bold">Reset Password</h3>
        
        <FormControl mb="5" isInvalid={!!error}>
          <InputGroup size="md">
            <Input
              required
              type={show ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={handleChange}
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
            isDisabled={!!error || loading}
            isLoading={loading}
          >
            Submit
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default ResetPassword;