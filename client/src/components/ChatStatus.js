import { useMutation, useSubscription } from "@apollo/client";
import { CHANGE_CHAT_STATUS } from "../shared/api/Mutations";
import { NEW_CHAT_STATUS } from "../shared/api/Subscriptions";

export const ChatStatus = ({ chatId }) => {

    

    const { data, loading } = useSubscription(NEW_CHAT_STATUS, {
        variables: { id: chatId }
    });

    if (data) {
        return ( <div>{!loading && data.isTyping ? "Someone is typing.." : ""}</div>);
    }
    
    return (
        <></>
    )
}