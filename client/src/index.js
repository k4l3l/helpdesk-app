import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';
import { WebSocketLink } from './shared/WebSocketLink';
import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { BrowserRouter } from 'react-router-dom';


const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include'
});

const wsLink = new WebSocketLink({
    url: 'ws://localhost:4000/graphql',
    // connectionParams: () => {
    //     //auth method here
    //     const session = null;
    //     if (!session) {
    //         return {};
    //     }
    //     return {
    //         Authorization: `Bearer ${session.token}`,
    //     };
    // },
});

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return (
            kind === 'OperationDefinition' &&
            operation === 'subscription'
        );
    },
    wsLink,
    httpLink
);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
});

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
