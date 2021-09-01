import { gql } from '@apollo/client';
import { MESSAGE_FIELDS, TICKET_STATUS_FIELDS } from './Fragments';

export const INIT_QUERY = gql`
{
  authInfo {
    userId
    name
    isAdmin
  }
}
`;

export const POSTS_QUERY = gql`
{	
    posts {
        id
        title
        content
        createdAt
        author {
          name
        }
    }  
}`;

export const CLIENT_TICKET_QUERY = gql`
${TICKET_STATUS_FIELDS}
query TicketStatusQuery($id: ID) {
  ticketStatus(id: $id) {
    ticket {
      ...TicketFields
    }
  }
}
`;

export const ADMIN_TICKETS_QUERY = gql`
${TICKET_STATUS_FIELDS}
{
  tickets {
    ...TicketFields
  }
}
`;

export const CHAT_MESSAGES_QUERY = gql`
${MESSAGE_FIELDS}
query ChatQuery($id: ID!){
  chat(id: $id) {
    ...MsgFields
  }
}
`;