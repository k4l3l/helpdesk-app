import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { APP_SECRET } from "../../utils.js";

function throwErr() {
    throw new Error("Invalid username or password!");
}

export default {
    Query: {

        users: async (parent, args, { prisma }, info) => {
            return await prisma.user.findMany();
        },

        info: (_,__,{ pubsub, cookies }) => {
            return "First steps in making a helpdesk app"; 
        },

        authInfo: (_,__,{ pubsub, userIdRoles }) => {
            if(!userIdRoles) {
                return null;
            }
            // { userId, roles, name }
            return userIdRoles;
        },

    },

    Mutation: {

        signup: async (parent, args, { prisma, res }, info) => {
            const password = await bcrypt.hash(args.password, 10);    
            
            const user = await prisma.user.create({ data: 
                {   ...args, 
                    password, 
                    roles: { connect: {  name: "USER"  } } 
                }
            });    
              
            const token = jwt.sign({ userId: user.id, isAdmin: false, name: user.name }, APP_SECRET);

            res.cookie('token', token, {
                maxAge: 7200000, // 2 hours
                httpOnly: true,
            });

            return {
                user
            }
        },

        login: async (parent, { username, password }, { prisma, res }, info) => {
            const user = await prisma.user.findUnique({ where: { username }, include: { roles: true } });
            if (!user) {
                throwErr();
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throwErr();
            }
            
            const isAdmin = !!user.roles.find(({ name }) => name === "ADMIN");

            const token = jwt.sign({ userId: user.id, isAdmin, name: user.name}, APP_SECRET);

            res.cookie('token', token, {
                maxAge: 7200000,
                httpOnly: true,
            });
        
            return {
                user
            }
        },

        logout: async (parent, _, { prisma, userIdRoles, res }) => {
            const user = await prisma.user.findUnique({ where: { id: userIdRoles.userId } });
            if (!user) {
                throwErr();
            }

            res.cookie('token', 'none', {
                expires: new Date(Date.now() + 5 * 1000),
                httpOnly: true,
            });

            return "Successful logout!";
        }
    },

    User: {

        roles: async (parent, _, { prisma }) => {
            let roles = await prisma.user.findUnique({ where: { id: parent.id }}).roles();
            return roles.map(r => r.name);
        },

        createdTickets: async (parent, _, { prisma }) => {
            let tickets = await prisma.user.findUnique({ where: { id: parent.id }}).createdTickets();
            return tickets;
        },        

        handledTickets: async(parent, _, { prisma }) => {
            return await prisma.user.findUnique({ where: { id: parent.id }}).handledTickets();
        }
    }

}