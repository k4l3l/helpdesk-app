import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Stack,
    Image,
  } from '@chakra-ui/react';
import { INIT_QUERY } from '../shared/api/Queries';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../shared/api/Mutations';

export const Login = () => {
    const history = useHistory();

    const [formState, setFormState] = useState({
        login: true,
        username: '',
        password: '',
        name: ''
    });

    const [login] = useMutation(LOGIN_MUTATION, {
        variables: {
            username: formState.username,
            password: formState.password
        },
        update(cache, { data: { login } }) {
          if (login.user) {
            cache.writeQuery({
              query: INIT_QUERY,  
              data: { authInfo: { userId: login.user.id, name: login.user.name, isAdmin: login.user.roles.includes("ADMIN") } }
            });
          }
        },
        onCompleted: ({ login }) => {
            history.push('/');
        }
    });

    const [signup] = useMutation(SIGNUP_MUTATION, {
        variables: {
            name: formState.name,
            username: formState.username,
            password: formState.password
        },
        onCompleted: () => {
            history.push('/');
        }
    });

    return (        
        <Stack minH={'93.2vh'} direction={{ base: 'column', md: 'row' }}>
        <Flex p={8} flex={1} align={'center'} justify={'center'}>
          <Stack spacing={4} w={'full'} maxW={'md'}>
            <Heading fontSize={'2xl'}>{formState.login
            ? 'Sign in to your account'
            : 'Create your account'}</Heading>
            {!formState.login && (<FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input type="text" 
                value={formState.name}
                onChange={(e) =>
                setFormState({
                    ...formState,
                    name: e.target.value
                })}
              />
            </FormControl>)}
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input type="text" 
                value={formState.username}
                onChange={(e) =>
                setFormState({
                    ...formState,
                    username: e.target.value
                })}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" 
                value={formState.password}
                onChange={(e) =>
                setFormState({
                    ...formState,
                    password: e.target.value
                })}
              />
            </FormControl>
            <Stack spacing={6}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Link color={'blue.500'}>Forgot password?</Link>
              </Stack>
              <Button colorScheme={'blue'} variant={'solid'}
              onClick={formState.login ? login : signup }>
                {formState.login ? 'Sign in' : 'Sign up'}
              </Button>
            </Stack>
            <Stack spacing={6}>
            <Button colorScheme={'blue'} variant={'solid'}
                onClick={(e) =>
                setFormState({
                    ...formState,
                    login: !formState.login
                })
                }
            >
                {formState.login
            ? 'need to create an account?'
            : 'already have an account?'}
            </Button>
            </Stack>
          </Stack>
        </Flex>
        <Flex flex={1}>
          <Image
            alt={'Login Image'}
            objectFit={'cover'}
            src={
              'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
            }
          />
        </Flex>
      </Stack>
    )
};