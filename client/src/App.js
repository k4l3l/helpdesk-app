import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import { PostList } from './components/PostList';
import { Login } from './components/Login';
import { CreatePost } from './components/CreatePost';
import Header from './components/Header';
import { ChakraProvider } from "@chakra-ui/react"
import { useQuery } from '@apollo/client';
import { INIT_QUERY } from "./shared/api/Queries";
import { Box } from "@chakra-ui/react";
import { CallRoom } from './components/CallRoom';
import { ClientTicket } from './components/ClientTicket';
import { TicketList } from './components/TicketList';
import { AdminTicket } from './components/AdminTicket';



function App() {

  const { data, loading, error } = useQuery(INIT_QUERY);  
 
    return <>{data &&( 
      <ChakraProvider>      
        <Header data={data.authInfo}/>
        <Box bg={'gray.600'} position={'relative'} minH={'93.2vh'}>
        <Switch>
            <Route exact path="/" component={() => <PostList isLogged={!!data.authInfo} />} />
            <Route exact path="/login" render={() => data.authInfo ? <Redirect to="/" /> : <Login />} />
            <Route exact path="/post/create" render={() => !data.authInfo || !data.authInfo?.isAdmin ? <Redirect to="/" /> : <CreatePost />} />
            <Route exact path="/ticket" render={() => !data.authInfo || data.authInfo?.isAdmin ? <Redirect to="/" /> : <ClientTicket userId={data.authInfo.userId} />} />
            <Route exact path="/ticket/:id" render={() => !data.authInfo || !data.authInfo?.isAdmin ? <Redirect to="/" /> : <AdminTicket userId={data.authInfo.userId} />} />
            <Route exact path="/tickets" render={() => data.authInfo?.isAdmin ? <TicketList /> : <Redirect to="/" />} />
            <Route path="*" component={() => <Redirect to="/" />}/>
        </Switch>
        </Box>
      </ChakraProvider>
    )}
    </>

}

export default App;
