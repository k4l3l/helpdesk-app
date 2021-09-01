import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { POSTS_QUERY } from '../shared/api/Queries';
import { CREATE_POST_MUTATION } from '../shared/api/Mutations';
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Textarea, 
} from '@chakra-ui/react';

export const CreatePost = () => {
    const history = useHistory();
    const [formState, setFormState] = useState({
        title: "",
        content: "",
    });

    const [createPost] = useMutation(CREATE_POST_MUTATION,
        {
            variables: {
                title: formState.title,
                content: formState.content
            },
            // temporary, should add the post to the cache
            refetchQueries: [
                { query: POSTS_QUERY }
            ],            
            onCompleted: () => history.push('/')
        }
    );

    return (
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} color={'white'}>Create post</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={'gray.600'}
          boxShadow={'lg'}
          p={8}
          minW={'45vh'}>
          <Stack spacing={4}>
            <FormControl id="title">
              <FormLabel color={'white'}>Title</FormLabel>
                <Input type="text" 
                    value={formState.title}
                    onChange={e => setFormState({
                            ...formState,
                            title: e.target.value
                    })
                    }                        
                    placeholder="A post title" 
                />
            </FormControl>
            <FormControl id="content">
              <FormLabel color={'white'}>Content</FormLabel>
              <Textarea 
                resize={"none"} 
                minH={"20vh"} 
                value={formState.content}
                onChange={(e) => 
                    setFormState({
                        ...formState,
                        content: e.target.value
                    })
                }                
                placeholder="Type the content here" 
              />
            </FormControl>
            <Stack spacing={10}>              
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={createPost}>
                Submit
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    )
};