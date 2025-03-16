import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  useToast,
  Input,
  Flex,
  Box,
  FormControl,
  Image,
} from '@chakra-ui/react';
import logo from '../assets/img/nexus-website-favicon-white.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5001';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/users/forgot-password`, { email });
      toast({
        title: 'Success',
        description: response.data.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      if (error.response?.status === 404) {
        toast({
          title: 'User Not Found',
          description: 'No account associated with this email. Redirecting to signup...',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });

        setTimeout(() => navigate('/signup'), 3000); // Redirect to signup after 3 seconds
      }
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
        <Image
          className="h-20 w-20 mx-auto justify-center"
          src={logo}
          alt="Logo"
        />
        <h3 className="text-white text-center mb-5 font-bold">
          Forgot Password
        </h3>
        <FormControl mb="5">
          <Input
            required
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            focusBorderColor="teal.800"
          />
        </FormControl>
        <Flex className="flex items-center justify-center space-x-2">
          <Button
            type="submit"
            bg="teal.800"
            _hover={{ bg: 'teal.700' }}
            color="white"
            fontWeight="bold"
            py={2}
            px={4}
            rounded="md"
            _focus={{ outline: 'none', shadow: 'outline' }}
          >
            Submit
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default ForgotPassword;