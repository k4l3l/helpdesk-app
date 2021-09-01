import {
    Box,
    Text,    
} from '@chakra-ui/react';

export const Message = ({ msg, userId }) => {
    const isMe = Number(userId) === Number(msg.author.id);
    return (
        <Box maxW={"38vh"}>
            <Text color={"white"} align={isMe ? "right" : "left"}><Text as={"span"} fontSize={"xs"} color={"rgba(255,255,255,0.3)"}>{isMe ? "You" : msg.author.name}:<br /></Text> {msg.message}</Text>
        </Box>
    )
}