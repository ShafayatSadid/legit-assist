// lib/auth.js
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(`${process.env.MONGODB_URI}`);
const db = client.db("legit-assist");

export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: null,
                input: true, // ✅ user নিজে set করবে /select-role থেকে
            },
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            strategy: "jwt",
            maxAge: 7 * 24 * 60 * 60,
        },
    },
    databaseHooks: {
        user: {
            update: {
                before: async (userData) => {
                    // ✅ শুধু user/lawyer allow — কেউ admin বানাতে পারবে না
                    if (
                        userData.role !== undefined &&
                        userData.role !== null &&
                        !["user", "lawyer"].includes(userData.role)
                    ) {
                        throw new Error("Invalid role. Only 'user' or 'lawyer' allowed.");
                    }
                    return { data: userData };
                },
            },
        },
    },
    plugins: [
        jwt({
            jwt: {
                definePayload: ({ user }) => ({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                }),
            },
        }),
    ],
});

export { db };