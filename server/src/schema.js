import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadFilesSync } from '@graphql-tools/load-files';
import _ from 'lodash-es';
import UserResolvers from "./api/user/resolvers.js";
import PostResolvers from "./api/post/resolvers.js";
import TicketResolvers from "./api/ticket/resolvers.js";
import MessageResolvers from "./api/message/resolvers.js";
import { applyMiddleware } from 'graphql-middleware';
import { permissions } from "./utils.js";



const typeDefs = loadFilesSync('./src/api/**/*.graphql');

const resolvers =  _.merge(UserResolvers, PostResolvers, TicketResolvers, MessageResolvers);

const schema = makeExecutableSchema({ typeDefs, resolvers });

// const schema = applyMiddleware(preSchema, permissions);

export default schema;