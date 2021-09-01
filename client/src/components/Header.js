import {
    Box,
    Flex,
    Avatar,
    HStack,
    Link,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
  } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { NavLink as ReactLink, useHistory } from "react-router-dom"
import { useMutation } from '@apollo/client';
import { withApollo } from '@apollo/client/react/hoc';
import { LOGOUT_MUTATION } from '../shared/api/Mutations';
import { CLIENT_TICKET_QUERY } from '../shared/api/Queries';

// maybe generate links from here
const Links = [
  {to: "/", name: "Home", logged: false}, 
  {to: "/post/create", name: "Create Post", logged: true}, 
  {to: "/ticket/open", name: "Open ticket", logged: true}, 
  {to: "/login", name: "Login"}
];
  
const NavLink = ({ to, name }) => (
  <Link
    as={ReactLink}
    px={2}
    py={1}
    rounded={'md'}
    activeClassName="active"
    exact
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    to={to}>
        {name}
  </Link>
);
  
function Header({ client, data }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isLogged = !!data;
  const isAdmin = data?.isAdmin;
  
  const history = useHistory();

  
  const [logout] = useMutation(LOGOUT_MUTATION, {
    // add toast with logout message
    onCompleted({ logout }) {
      // clearStore and resetStore are async and can't push to login if they haven't resolved first
      client.clearStore().then(() => {
        client.resetStore().then(() => {
          console.log(logout);      
          history.push('/login');
        });
      });
    }
  });

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>Logo</Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              <NavLink to="/" name="Home" />
              {isLogged && (
              <>
                { isAdmin ? ( <><NavLink to="/tickets" name="Tickets" /><NavLink to="/post/create" name="Create Post" /></>): <NavLink to="/ticket" name="Ticket" />}
              </>
              )}
              {!isLogged && <NavLink to="/login" name="Login" />}              
            </HStack>
          </HStack>
          {isLogged && (
            <Flex alignItems={'center'}>
              <Menu>
                <Box marginRight={2}>Hello, {data.name}!</Box>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    src={
                      '#'
                    }
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem>Link 1</MenuItem>
                  <MenuItem>Link 2</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          )}
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              <NavLink to="/" name="Home" />
              {isLogged && (
              <>
                <NavLink to="/post/create" name="Create Post" />
                <NavLink to="/ticket/open" name="Ticket" />
                <NavLink to="/chat" name="Chat room" />
              </>
              )}
              {!isLogged && <NavLink to="/login" name="Login" />}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}

export default withApollo(Header);