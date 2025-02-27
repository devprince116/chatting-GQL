import "reflect-metadata"
import { ApolloServer } from "apollo-server";
import { typeDefs } from "./common/schema/typeDefs";
import { resolvers } from "./common/schema/resolvers";
import dotenv from "dotenv";
import { loadConfig } from "./common/helper/config.helper";
import { initDb } from "./common/service/database.service";
import { verifyToken } from "./auth/auth.controller";
import express from "express";
import cors from "cors";
dotenv.config();
loadConfig()
const PORT = process.env.PORT;

const startServer = async () => {

    const app = express();
    app.use(express.json());
    app.use(cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }));
    await initDb();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            const token = req.headers.authorization || "";
            try {
                const user = verifyToken(token.replace("Bearer ", ""));
                // console.log(user)
                return { success: true, user };
            } catch {
                return {
                    success: false,
                    message: "Invalid Token"
                };
            }
        },
    });

    server.listen(PORT).then(({ url }) => {
        console.log(`Server ready at ${url}`);
    });
};

startServer();
