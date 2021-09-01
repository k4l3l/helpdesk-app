import {
    Box,    
    Button,
    VStack,
    Text,
    SimpleGrid,
    Input,
    HStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { CHAT_MESSAGES_QUERY } from '../shared/api/Queries';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { Message } from './Message';
import { CHANGE_CHAT_STATUS, SEND_MESSAGE_MUTATION } from '../shared/api/Mutations';
import { NEW_CHAT_MESSAGE, NEW_CHAT_STATUS } from '../shared/api/Subscriptions';
import { ChatStatus } from './ChatStatus';


export const Chat = ({ userId, chatId }) => {
    const [msg, setMsg] = useState("");
    const scroll = useRef(null);
    const input = useRef(null);
    const { data, subscribeToMore } = useQuery(CHAT_MESSAGES_QUERY, {
        variables: {
            id: chatId
        }
    });

    subscribeToMore({
        document: NEW_CHAT_MESSAGE,
        variables: { id: chatId },
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const newMsg = subscriptionData.data.newMsg;
            
            const exists = prev.chat.find(m => m.id === newMsg.id);
            if(exists) return prev;
            return {
                ...prev,
                chat: [
                    ...prev.chat,
                    newMsg
                ]
            };
        }
    });

    const [sendMsg] = useMutation(SEND_MESSAGE_MUTATION, {
        onCompleted: () => {
            input.current.value="";
        }
    });

    const [changeChatStatus] = useMutation(CHANGE_CHAT_STATUS);

    let timer = null;

    const handleChange = () => {
        clearTimeout(timer);
        changeChatStatus({ variables: { id: chatId, isTyping: "yes" }});
        timer = setTimeout(() => {
            changeChatStatus({ variables : { id: chatId, isTyping: null }});
        }, 3000)
    };
    

    const scrollToBottom = () => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    })


    return (
        <Box>
            <Box maxH={"25vh"} minH={"25vh"} overflowY={"scroll"} display={"flex"} flexDirection={"column"}>
                <SimpleGrid columns={{ base: 1 }} spacing={10}>
                    <VStack spacing={"20px"} align={"stretch"}>
                    {data &&<>
                    {data.chat.map(m => <Message key={m.id} msg={m} userId={userId} />)}
                    </>}
                    <div style={{ float:"left", clear: "both" }} ref={scroll}></div>
                    <ChatStatus chatId={chatId} />
                    </VStack>
                </SimpleGrid>
            </Box>
            <HStack marginTop={"10px"}>
                <Input color={"white"} onChange={e => setMsg(e.target.value)} onKeyDown={handleChange} ref={input} type={"text"}></Input>
                <Button onClick={() => sendMsg({ variables: { id: chatId, msg }})}>Send</Button>
            </HStack>
        </Box>
    )
}