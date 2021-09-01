import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import ws from 'ws';
import pkg from "@prisma/client";
import { useServer } from 'graphql-ws/lib/use/ws';
import { getUserInfo } from "./utils.js";
import cookieParser from 'cookie-parser';
import cors from "cors";
import initiateSeed from '../prisma/seed.js';
import schema from './schema.js';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

export async function startApolloServer() {
    
    const { PrismaClient } = pkg;
    const prisma = new PrismaClient();

    const isSeeded = await prisma.role.findFirst();

    if (!isSeeded) {
        initiateSeed();
    }

    // const __dirname = new URL('.', import.meta.url).pathname.slice(1);

    const options = {
        host: "localhost",
        port: 6379,
        retryStrategy: times => {
          // reconnect after
          return Math.min(times * 50, 2000);
        }
      };
      
    const pubsub = new RedisPubSub({
        publisher: new Redis(options),
        subscriber: new Redis(options)
    });

    const app = express();


    const apolloServer = new ApolloServer({
        schema, 
        context: ({ req, res }) => ({
            ...req,
            prisma,
            pubsub,
            res,
            userIdRoles:
                req && req.cookies.token ? getUserInfo(req) : null,
        }),
        playground: true,
    });

    // const allowedOrigins = ["http://localhost:3000", "https://studio.apollographql.com"]

    const corsOpts = {
        // origin: function (origin, callback) {
        //     if (allowedOrigins.indexOf(origin) !== -1) {
        //       callback(null, true)
        //     } else {
        //       callback(new Error('Not allowed by CORS'))
        //     }
        // },
        origin: "http://localhost:3000",
        credentials: true
    };

    app.use(cors(corsOpts), cookieParser());

    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });    

    // for graphiql ui in browser
    // app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));

    const port = process.env.port || 4000;
    
    const server = app.listen(port, () => {

        const wsServer = new ws.Server({
            server,
            path: '/graphql',
        });

        // must pass same context as in apollo server here for it to work when a subscription happens
        useServer({ 
            schema, 
            context: ({ req, res }) => ({
                ...req,
                prisma,
                pubsub,
                res,
                userIdRoles:
                    req && req.cookies.token ? getUserInfo(req) : null,}) 
            }, wsServer);

        console.log(`Server ready at http://localhost:${port}${apolloServer.graphqlPath}`);
    });
    
    return { apolloServer, server };
}
