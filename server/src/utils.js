import jwt from "jsonwebtoken";
import { shield, rule, allow } from'graphql-shield';

export const APP_SECRET = "Wh4t3v3r";


function getTokenPayload(token) {
    return jwt.verify(token, APP_SECRET);
}

export function getUserInfo(req, authToken) {
    if (req) {
        const cookies = req.cookies;
        if (cookies) {
            const { token } = cookies;
            if (!token) {
                throw new Error("No token found!");
            }
            // if user logged out just now and queries the db before the cookie disappears
            if(token === "none") {
                return null;
            }
            const userInfo = getTokenPayload(token);
            return userInfo;
        }
    } else if (authToken) {
        const userInfo = getTokenPayload(authToken);
        return userInfo;
    }

    throw new Error("Not authenticated");
}

const isAdmin = rule()(async (parent, args, ctx, info) => {
    return ctx.userIdRoles.isAdmin;
});

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
    return !!ctx.userIdRoles.userId;
});

export const permissions = shield({
    Query: {
        ticketStatus: isAuthenticated,
    },
    Mutation: {
        createPost: isAdmin,
        updatePost: isAdmin,
        deletePost: isAdmin,
    }        
});
