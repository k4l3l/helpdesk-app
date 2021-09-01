export default {

    Query: {
        chat: async (parent, { id }, { prisma, userIdRoles }) => {
            // use negative take to get last items only
            return await prisma.message.findMany({ where: { ticket: { id: Number(id) } }, include:{ author: true } });
        },        

    },

    Mutation: {
        sendMsg: async (parent, { id, message }, { prisma, userIdRoles, pubsub }) => {
            const msg = await prisma.message.create({ 
                data: { 
                    message,
                    author: { connect: { id: userIdRoles.userId } },
                    ticket: { connect: { id: Number(id) } }
                }
            });

            pubsub.publish("NEW_MESSAGE_TICKET_"+id, { newMsg: msg });
            return msg;
        },

        changeChatStatus: async(parent, { id, isTyping }, { prisma, userIdRoles, pubsub }) => {
            const chatStatus = {
                isTyping: !!isTyping
            };

            pubsub.publish("NEW_CHAT_STATUS_"+id, {
                chatStatus
            });

            return chatStatus;
        },
    },    
    

    Subscription: {
        newMsg: {
            subscribe: (_,args, { pubsub }) => pubsub.asyncIterator(["NEW_MESSAGE_TICKET_"+args.id]),
        },

        chatStatus: {
            subscribe: (_, { id }, { pubsub }) => pubsub.asyncIterator(["NEW_CHAT_STATUS_"+id]),
        },
    },

    Message: {
        author: async (parent, args, { prisma }) => {
            return await prisma.message.findUnique({ where: { id: parent.id }}).author();
        },
        ticket: async (parent, args, { prisma }) => {
            return await prisma.message.findUnique({ where: { id: parent.id }}).ticket();
        },
    }
    
}