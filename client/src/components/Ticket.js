import {
    Text,
    HStack,
    VStack,
    Button,
} from '@chakra-ui/react';
import { HANDLE_TICKET_MUTATION, LEAVE_TICKET_MUTATION } from '../shared/api/Mutations';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';


export const Ticket = ({ data }) => {

    const history = useHistory();
    
    const [acceptTicket] = useMutation(HANDLE_TICKET_MUTATION, {
        onCompleted: ({ acceptTicket }) => {
            history.push("/ticket/"+acceptTicket.id);
        }
    });
    const [leaveTicket] = useMutation(LEAVE_TICKET_MUTATION);

    return (
        <HStack align={'top'}>
            <VStack align={'start'}>
                <Text fontWeight={600} color={'white'}>Title: {data.title}</Text>
                <Text fontWeight={600} color={'white'}>Description: {data.description}</Text>
                <Text fontWeight={600} color={'white'}>By: {data.creator?.name}</Text>
                <Text fontWeight={600} color={'white'}>Status: {data.handler ? `Handled by ${data.handler.name}` : (data.isOpen ? "OPEN" : "CLOSED")}</Text>
                <HStack>
                    <Button onClick={() => acceptTicket({ variables: { id: data.id }})}>Handle ticket</Button>
                    <Button onClick={() => leaveTicket({ variables: { id: data.id }})}>Leave ticket</Button>
                </HStack>
            </VStack>
        </HStack>
    )
}