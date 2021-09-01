import { withFilter } from 'graphql-subscriptions';

export default {
//#region Queries
    Query: {

        ticketStatus: async(parent, args, { prisma, userIdRoles }) => {
            // temporary for when unauthorized client queries
            if (userIdRoles) {
                if (userIdRoles.isAdmin) {
                    const ticket = await prisma.ticket.findUnique({ where: { id: Number(args.id)}, include: { handler: true, creator: true } });
                    return { ticket };
                }
                const ticket = await prisma.ticket.findMany({ where: { creator: { id: userIdRoles.userId }, isOpen: true }, include:{ handler: true }});
                return { ticket: ticket[0] };
            }
        },

        tickets: async (parent, args, { prisma, userIdRoles }) => {
            return await prisma.ticket.findMany({ where: { isOpen: true }, include:{ handler: true, creator: true }, orderBy: { id: "desc" }});
        },        
    },

//#endregion

//#region Mutations
    Mutation: {

        openTicket: async(parent, { title, description }, { prisma, userIdRoles, pubsub }) => {

            const ticket = await prisma.ticket.create({              
                data: {
                    title, description, isOpen: true, creator: { connect: { id: userIdRoles.userId } }
                }
            });

            pubsub.publish("NEW_TICKETLIST_INFO", { newTicket: {                
                ticket
            } });

            return ticket;

        },

        acceptTicket: async(parent, { id }, { prisma, userIdRoles, pubsub }) => {
            const acceptedTicket = await prisma.ticket.update({
                where: { id: Number(id) },                
                data: { handler: { connect: { id: userIdRoles.userId } } },
                include: { creator: true },
            });

            pubsub.publish("NEW_TICKETLIST_INFO", { newTicket: {                
                ticket: acceptedTicket
            } });
            pubsub.publish("NEW_TICKET_STATUS_"+id , { ticketStatus:  {
                ticket: acceptedTicket
            } });

            return acceptedTicket;
        },

        leaveTicket: async(parent, { id }, { prisma, userIdRoles, pubsub }) => {
            const leftTicket = await prisma.ticket.update({
                where: { id: Number(id) },
                data: { handler: { disconnect: true} },
                include: { creator: true },
            });

            pubsub.publish("NEW_TICKETLIST_INFO", { newTicket: {                
                ticket: leftTicket
            } });
            pubsub.publish("NEW_TICKET_STATUS_"+id , { ticketStatus: { 
                ticket: leftTicket
            } });

            return leftTicket;
        },

        closeTicket: async(parent, { id }, { prisma, userIdRoles }) => {
            const closedTicket = await prisma.ticket.upsert({
                where: { id: Number(id) },
                create: { },
                update: { isOpen: false },
                include: { creator: true },
            });

            pubsub.publish("NEW_TICKET_STATUS_"+id , { ticketStatus: { ticket: closedTicket } });

            return closedTicket;
        },

    },
//#endregion

//#region Subscriptions
    Subscription: {

        ticketStatus: {
            // adding id to channel out the sub to a specific client
            subscribe: (_,args, { pubsub }) => pubsub.asyncIterator(["NEW_TICKET_STATUS_"+args.id]),
        },

        newTicket: {
            subscribe: (_,__, { pubsub }) => pubsub.asyncIterator(["NEW_TICKETLIST_INFO"]),
        },

    },
    
    Ticket: {

        creator: async (parent, args, { prisma }) => {
            return await prisma.ticket.findUnique({ where: { id: parent.id }}).creator();
        },
    
        handler: async (parent, args, { prisma }) => {
            const user = await prisma.ticket.findUnique({ where: { id: parent.id }}).handler();
            return user ? user : null;
        },

        messages: async (parent, { take }, { prisma }) => {
            const messages = await prisma.ticket.findMany({ where: { id: parent.id }, take }).messages();
            return messages ? messages : [];
        },

    },
    //#endregion
}