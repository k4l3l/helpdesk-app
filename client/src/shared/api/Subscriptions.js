import { gql } from '@apollo/client';
import { MESSAGE_FIELDS, TICKET_STATUS_FIELDS } from './Fragments';

export const NEW_POSTS_SUB = gql`
    subscription {
        newPost {
            id
            title
            content
        }
    }
`;

export const NEW_TICKET_STATUS = gql`
    subscription TicketStatus($id: ID!) {
        ticketStatus(id: $id) {
            ticket {
                ...TicketFields
            }
        }
    }
    ${TICKET_STATUS_FIELDS}
`;

export const NEW_TICKETLIST_INFO = gql`
    subscription {
        newTicket {            
            ticket {
                ...TicketFields
            }            
        }
    }
    ${TICKET_STATUS_FIELDS}
`;

export const NEW_CHAT_MESSAGE = gql`
${MESSAGE_FIELDS}
    subscription NewMsg($id: ID!){
        newMsg(id: $id) {
            ...MsgFields
        }
    }
`;

export const NEW_CHAT_STATUS = gql`
    subscription NewChatStatus($id: ID!){
        chatStatus(id: $id, isTyping: $isTyping) {
            isTyping
        }
    }
`;