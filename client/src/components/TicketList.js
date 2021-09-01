import {
    Stack,
    StackDivider,
    Text,
    useColorModeValue,
    HStack,
    VStack,
    Container,
    SimpleGrid,
    Button,
    Heading
} from '@chakra-ui/react';
import { ADMIN_TICKETS_QUERY } from '../shared/api/Queries';
import { useQuery } from '@apollo/client';
import { NEW_TICKETLIST_INFO } from '../shared/api/Subscriptions';
import { Ticket } from './Ticket';

export const TicketList = () => {

    const { data, loading, error, subscribeToMore } = useQuery(ADMIN_TICKETS_QUERY);    

    subscribeToMore({
        document: NEW_TICKETLIST_INFO,
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const newTicket = subscriptionData.data.newTicket.ticket;
            const exists = prev.tickets.find(t => t.id === newTicket.id);
            
            if (exists) {
                const tickets = prev.tickets.map(t => {
                    if (t.id === newTicket.id) {
                        return newTicket;
                    }
                    return t;
                });
                return {...prev, tickets};
            }            
            return Object.assign({}, prev, {
                tickets: [newTicket, ...prev.tickets],
                __typename: prev.tickets.__typename            
            });
        }
    });    

    return (
        <Container maxW={'5xl'} py={12}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <Stack
                spacing={4}
                divider={
            <StackDivider
                borderColor={useColorModeValue('gray.100', 'gray.700')}
            />
            }>
            {loading && <Heading color={'white'}>Loading...</Heading>}
            {data && (
                data.tickets.map( t => (<Ticket key={t.id} data={t} />))
            )}
            </Stack>
            </SimpleGrid>
        </Container>
    )
};