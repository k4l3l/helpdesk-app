export default {
    Query: {
        // will make custom order filters and take, skip when pagination is implemented
        posts: async (root, { take, skip, filter }, { prisma }, info) => {
            return await prisma.post.findMany({ orderBy: {
                createdAt: 'desc',
            },
            take });
        },
    },

    Mutation: {
        createPost: async (parent, { title, content }, { prisma, userIdRoles, pubsub }, info) => {    

            const post = await prisma.post.upsert({
                where: { title },
                update: { },
                create: {
                    title, content, author: { connect: { id: userIdRoles.userId } }
                }
            }); 
    
            pubsub.publish("NEW_POST", { newPost: post } );
    
            return post;
        },
    
        updatePost: async (parent, { id, title, content }, { prisma, userIdRoles }, info) => {
            return await prisma.post.upsert({
                where: { id: Number(id) },
                update: { title, content },
                create: { title, content, author: { connect: { id: userIdRoles.userId } } }
            });
        },
    
        deletePost: async (parent, { id }, { prisma }, info) => {
            return await prisma.post.delete({ where: { id: Number(id) } });
        }
    },

    Subscription: {
        newPost: {
            subscribe: (_,__,{ pubsub }) => pubsub.asyncIterator(["NEW_POST"]),        
        }    
    },

    Post: {
        author: async (parent, args, { prisma }) => {
            return await prisma.post.findUnique({ where: { id: parent.id }}).author();
        },
    }
}