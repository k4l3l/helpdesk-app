import { useQuery, useMutation } from '@apollo/client';
import { POSTS_QUERY } from '../shared/api/Queries';
import { DELETE_POST_MUTATION } from '../shared/api/Mutations';
import { NEW_POSTS_SUB } from '../shared/api/Subscriptions';
import {
    Stack,
    Container,
    Box,
    Flex,
    Text,
    Heading,
    SimpleGrid,
    Button,
} from '@chakra-ui/react';
import { reverseBSearch } from '../shared/utils';


export const PostList = ({ isLogged }) => {
    const { data, loading, error, subscribeToMore } = useQuery(POSTS_QUERY);
    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        update(cache, { data: { deletePost } }) {
            const { posts } = cache.readQuery({
                query: POSTS_QUERY
            });

            const updatedPosts = posts.filter(p => p.id !== deletePost.id);

            cache.writeQuery({
                query: POSTS_QUERY,
                data: {
                    posts: updatedPosts
                }
            });
        }
    });

    subscribeToMore({
        document: NEW_POSTS_SUB,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const newPost = subscriptionData.data.newPost;
          const exists = prev.posts.find(p => p.id === newPost.id);
          if (exists) return prev;
      
          return Object.assign({}, prev, {
            posts: [...prev.posts, newPost],              
            __typename: prev.posts.__typename            
          });
        }
    });    

    return (
        <>
        {loading && <h1>Loading...</h1>}
        {error && <p>{JSON.stringify(error)}</p>}
        {data && (
        <Box>
            <Flex
                flex={1}
                display={{ base: 'none', lg: 'flex' }}
                backgroundImage="url('/templates/stats-grid-with-image.png')"
                backgroundSize={'cover'}
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                position={'absolute'}
                width={'50%'}
                insetY={0}
                right={0}>
            <Flex
                bgGradient={'linear(to-r, gray.600 10%, transparent)'}
                w={'full'}
                h={'full'}
            />
            </Flex>
            <Container maxW={'7xl'} position={'relative'}>
                <Stack direction={{ base: 'column' }}>
                <Stack
                    flex={1}
                    color={'gray.400'}
                    justify={{ lg: 'center' }}
                    py={{ base: 4, md: 10, xl: 20 }}>
                    <Box mb={{ base: 8, md: 10 }}>
                        <Text
                            fontFamily={'heading'}
                            fontWeight={700}
                            textTransform={'uppercase'}
                            mb={3}
                            fontSize={'xl'}
                            color={'gray.500'}>
                            Posts
                        </Text>
                        <Heading
                            color={'white'}
                            mb={5}
                            fontSize={{ base: '3xl', md: '5xl' }}>
                            Latest troubleshooting posts
                        </Heading>
                        <Text fontSize={'xl'} color={'gray.400'}>
                            Here you can find solutions to your problem. You can look for a solution, or sign in and open a ticket.
                        </Text>
                    </Box>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={20} minChildWidth="40%">
                    {data.posts.map((p) => (
                        <Box key={p.id}>
                        <Text
                            fontFamily={'heading'}
                            fontSize={'3xl'}
                            color={'white'}
                            mb={3}>
                            {p.title}
                        </Text>
                        <Text fontSize={'xl'} color={'gray.400'}>
                            {p.content.slice(0,100)+"..."}
                        </Text>
                        <Text color={'white'} fontSize={'l'}>Created: {new Date(Number(p.createdAt)).toLocaleString()} by {p.author.name}</Text>
                        {isLogged &&
                            <Button onClick={() => deletePost({variables: { id: Number(p.id) } })}>delete</Button>
                        }
                        </Box>
                    ))}
                    </SimpleGrid>
                </Stack>
                <Flex flex={1} />
                </Stack>
            </Container>
        </Box>
        )}
        </>
    );
};
