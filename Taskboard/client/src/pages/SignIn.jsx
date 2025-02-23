import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../util.jsx';
import { useUser } from '../context/UserContext.jsx';
import {
  FormControl,
  Input,
  Button,
  Text,
  Box,
  Flex,
  Heading,
  Stack,
  FormErrorMessage,
  theme,
} from '@chakra-ui/react';
import toast from 'react-hot-toast';

export default function SignIn() {
  const navigate = useNavigate(); // useNavigate=> Pre define imported from react-router-dom
  const { updateUser } = useUser(); // userUser => User define method
  const {
    handleSubmit, // method => use to handle the submission of the form
    register,     //method => use to allocation of values and error
    formState: { errors, isSubmitting }, // formstate=> state object
  } = useForm();
  const doSubmit = async values => {     //event handler
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signin`, { //here is more than one controllers that's why we need routing  
                                                                 //Client request send to server and server forwarded the request to appropiate router
                                                                 //Server needs URI prefix on the basis of URI prefix server select the router
                                                                 // API_BASE_URL => util.jsx 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // credentils => By default windows doesn't allow to 
        body: JSON.stringify(values), //stringify => convert js object in JSON string
                                      // values => have that data which form has send to doSubmit
      });
      const data = await res.json(); // data which have recieved from server is in res and it is stored into data
      if (res.status === 200) {
        toast.success('Sign In Successful');
       ` updateUser(data);` //user define
        navigate('/profile'); //Pre define -> react-router-dom
      } else {
        toast.error(data.message); // toast-> react-hot-toast
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };
  return (
    <Box p='3' maxW='lg' mx='auto'>
      <Heading
        as='h1'
        textAlign='center'
        fontSize='3xl'
        fontWeight='semibold'
        my='7'
      >
        Enter Your Credentials
      </Heading>
      <form onSubmit={handleSubmit(doSubmit)}>
        <Stack gap='4'>
          <FormControl isInvalid={errors.email}>
            <Input
              id='email'
              type='email'
              placeholder='email'
              {...register('email', { required: 'Email is required' })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password}>
            <Input
              id='password'
              type='password'
              placeholder='password'
              {...register('password', {
                required: 'Password is required'
              })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            type='submit'
            isLoading={isSubmitting}
            colorScheme='teal'
            textTransform='uppercase'
          >
            Sign In
          </Button>
        </Stack>
      </form>
      <Flex gap='2' mt='5'>
        <Text>Dont have an account?</Text>
        <Link to={'/signup'}>
          <Text as='span' color='blue.400'>
            Sign up
          </Text>
        </Link>
      </Flex>
    </Box>
  );
}
  //  Stack => Stack is used to group element together and apply a space between them

  //  Flex => flex is used to create responsive design