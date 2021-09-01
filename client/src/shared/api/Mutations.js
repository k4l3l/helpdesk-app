import { gql } from '@apollo/client';
import { MESSAGE_FIELDS, TICKET_STATUS_FIELDS } from './Fragments';

//#region Post mutations
export const CREATE_POST_MUTATION  = gql`
    mutation PostMutation($title: String! $content: String!) {
        createPost(title: $title content: $content) {
            id
            title
            content
            author {
                name
            }
        }
    }
`;

export const DELETE_POST_MUTATION = gql`
    mutation deletePost($id: ID!) {
    deletePost(id: $id) {
        id
        title
        content
    }
}
`;
//#endregion

//#region Ticket mutations
export const OPEN_TICKET_MUTATION = gql`
${TICKET_STATUS_FIELDS}
  mutation OpenTicketMutation($title: String!, $description: String!) {
    openTicket(title: $title, description: $description) {
      ...TicketFields
    }
  }
`;

export const HANDLE_TICKET_MUTATION = gql`
${TICKET_STATUS_FIELDS}
  mutation HandleTicketMutation($id: ID!) {
    acceptTicket(id: $id) {
      ...TicketFields
    }
  }
`;

export const LEAVE_TICKET_MUTATION = gql`
${TICKET_STATUS_FIELDS}
  mutation LeaveTicketMutation($id: ID!) {
    leaveTicket(id: $id) {
      ...TicketFields
    }
  }
`;
//#endregion

//#region Message mutations
export const SEND_MESSAGE_MUTATION = gql`
${MESSAGE_FIELDS}
  mutation SendMsgMutation($id: ID!, $msg: String!) {
    sendMsg(id: $id, message: $msg) {
      ...MsgFields
    }
  }
`;

export const CHANGE_CHAT_STATUS = gql`
  mutation ChangeChatStatus($id: ID!, $isTyping: String) {
    changeChatStatus(id: $id, isTyping: $isTyping) {       
      isTyping
    }
  }
`;
//#endregion

//#region User mutations
export const SIGNUP_MUTATION = gql`
  mutation SignupMutation($username: String! $password: String! $name: String!) {
        signup(username: $username password: $password name: $name) {
            user {
              id
              name
              roles
            }
        }
    }
`;

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($username: String! $password: String!) {
    login(username: $username, password: $password) {
        user {
          id
          name
          roles
          createdTickets {
            id
            title
          }
          handledTickets {
            id
            title
          }          
        }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
mutation {
  logout
}
`;

//#endregion