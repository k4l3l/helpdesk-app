import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Textarea, 
    Text
} from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client';
import { CLIENT_TICKET_QUERY, INIT_QUERY } from '../shared/api/Queries';
import { OPEN_TICKET_MUTATION } from '../shared/api/Mutations';
import { useState } from "react";
import { NEW_TICKET_STATUS } from '../shared/api/Subscriptions';
import { Chat } from "./Chat";

const TicketForm = () => {
    const [formState, setFormState] = useState({
      title: "",
      description: ""
    });

    const [openTicket] = useMutation(OPEN_TICKET_MUTATION,{
      variables: {
        title: formState.title,
        description: formState.description,
      },
      update(cache, { data: { openTicket } }) {
        cache.writeQuery({
          query: CLIENT_TICKET_QUERY,
          data: {
            ticketStatus: {
              ticket: {
                // typename is required otherwise the query wont connect the object data...
                __typename: "Ticket",
                id: openTicket.id,
                title: openTicket.title,
                description: openTicket.description,
                isOpen: openTicket.isOpen,
                handler: null,
                creator: {
                  name: openTicket.creator.name
                }
              }
            }
          }
        });
      },
    })

    return (
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} color={'white'}>Create ticket</Heading>
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
              <Input type="text"onChange={(e) => setFormState({...formState, title: e.target.value}) } />
            </FormControl>
            <FormControl id="description">
              <FormLabel color={'white'}>Description</FormLabel>
              <Textarea resize={"none"} minH={"20vh"} placeholder="Describe your problem here" onChange={(e) => setFormState({...formState, description: e.target.value}) } />
            </FormControl>
            <Stack spacing={10}>              
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={openTicket}
                >
                Submit
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    )
}

const TicketStatus = ({ ticket }) => {
    const [chatOpen, setChatOpen] = useState(false);
    const { data } = useQuery(INIT_QUERY);

    return (
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} color={'white'}>Ticket status</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={'gray.600'}
          boxShadow={'lg'}
          p={8}
          minW={'45vh'}>
          <Stack spacing={5}>
            <Text
                fontFamily={'heading'}
                fontSize={'xl'}
                color={'white'}>
                Status: {ticket.handler ? `Being handled by ${ticket.handler.name}` : (ticket.isOpen ? "OPEN" : "CLOSED")}
            </Text>
            <Text
                fontFamily={'heading'}
                fontSize={'2xl'}
                color={'white'}>
                Title: {ticket.title}
            </Text>
            <Text
                fontFamily={'heading'}
                fontSize={'xl'}
                color={'white'}>
                Description: {ticket.description}
            </Text>
            <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                    bg: 'blue.500',
                }}
                onClick={() => setChatOpen(!chatOpen)}>
                 {chatOpen ? "Close" : "Open"} chat &gt;&gt;
            </Button>
            { data.authInfo && chatOpen && <Chat chatId={ticket.id} userId={data.authInfo.userId}/>}
          </Stack>
        </Box>
      </Stack>
    )
}

export const ClientTicket = () => {

  const { data, loading, error, subscribeToMore } = useQuery(CLIENT_TICKET_QUERY, {
    // temporary
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first"
  });
  if (data?.ticketStatus?.ticket) {
    subscribeToMore({
      document: NEW_TICKET_STATUS,
      variables: { id: data ? data.ticketStatus.ticket.id : null },
      updateQuery: (prev, { subscriptionData }) => {
        const newTicket = subscriptionData.data.ticketStatus.ticket;
        // return Object.assign({}, prev, {
        //     ticketStatus: {
        //       ticket: newTicket,
        //       __typename: prev.ticketStatus.ticket.__typename
        //     },
        //     __typename: prev.ticketStatus.__typename
        // });
        return {...prev, ticketStatus: {
          ...prev.ticketStatus,
          ticket: {
            ...prev.ticketStatus.ticket,
            newTicket
          }
        }};
      }
    });   
  }


  return (<>
      {loading && <Heading color={'white'}>Loading..</Heading>}
      {data && data.ticketStatus?.ticket ? <TicketStatus ticket={data.ticketStatus.ticket} /> : <TicketForm />}
      </>
  )
}