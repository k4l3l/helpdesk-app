import { gql } from "@apollo/client";

export const TICKET_STATUS_FIELDS = gql`
    fragment TicketFields on Ticket {
        id
        title
        description
        isOpen
        handler {
            name
        }
        creator {
            id
            name
        }
    }
`;

export const MESSAGE_FIELDS = gql`
    fragment MsgFields on Message {
        id
        author {
            id
            name
        }
        sentAt
        message
    }
`;