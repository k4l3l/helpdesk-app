import {
    Stack,
    Heading,
    Box,
    Text,
    SimpleGrid,
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { CLIENT_TICKET_QUERY } from "../shared/api/Queries";
import { Chat } from "./Chat";
import { useParams } from "react-router-dom";

export const AdminTicket = ({ userId }) => {

    const { id } = useParams();
    const { data, loading, error } = useQuery(CLIENT_TICKET_QUERY, {
        // temporary
        variables: { id },
        fetchPolicy: "cache-and-network",
        nextFetchPolicy: "cache-first",
      });

    return (<>
        {data &&
        <Stack spacing={8} py={12} px={6} maxW={"100vh"}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} color={'white'}>Details for ticket id {id}</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={'gray.600'}
          boxShadow={'lg'}
          p={8}
          minW={'45vh'}>
        <SimpleGrid columns={{ base: 1, lg: 2 }}>
          <Stack spacing={5}>            
            <Text
                fontFamily={'heading'}
                fontSize={'2xl'}
                color={'white'}>
                Title: {data.ticketStatus.ticket.title}
            </Text>
            <Text
                fontFamily={'heading'}
                fontSize={'xl'}
                color={'white'}>
                Description: {data.ticketStatus.ticket.description}
            </Text>            
          </Stack>
            <Chat chatId={data.ticketStatus.ticket.id} userId={userId}/>
      </SimpleGrid>
        </Box>
      </Stack>
    }
    </>)
}