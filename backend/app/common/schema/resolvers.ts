import { AuthenticationError, UserInputError } from "apollo-server-express";
import bcrypt from "bcryptjs";
import { User } from "../entity/User";
import { Message } from "../entity/Message";
import { AppDataSource } from "../service/database.service";
import { generateToken, verifyToken } from "../../auth/auth.controller";

const userRepo = AppDataSource.getRepository(User);
const messageRepo = AppDataSource.getRepository(Message);

export const resolvers = {
    Query: {
        me: async (_: any, __: any, context: any) => {
            if (!context.user) throw new AuthenticationError("Not authenticated");

            const currentUser = await userRepo.findOne({ where: { id: context.user.userId } });
            if (!currentUser) throw new AuthenticationError("User not found");

            return currentUser
        },

        messages: async (_: any, { receiverId }: { receiverId: string }, context: any) => {
            if (!context.user) throw new AuthenticationError("Not authenticated");

            const messages = await messageRepo.find({
                where: [
                    { sender: { id: context.user.userId }, receiver: { id: receiverId } },
                    { sender: { id: receiverId }, receiver: { id: context.user.userId } },
                ],
                relations: ["sender", "receiver"],
            });

            return messages;
        },

        users: async (_: any, __: any, context: any) => {
            if (!context.user) throw new AuthenticationError("Not authenticated");

            const users = await userRepo.find();
            return { success: true, message: "Users fetched successfully", users };
        },
    },

    Mutation: {
        signup: async (_: any, { email, password, name }: { email: string; password: string; name: string }) => {
            const userRepository = AppDataSource.getRepository(User);

            // Check if the user already exists
            const existingUser = await userRepository.findOne({ where: { email } });
            if (existingUser) {
                throw new Error("User already exists");
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = userRepository.create({ email, password: hashedPassword, name });
            await userRepository.save(newUser);

            // Generate access token
            const accessToken = generateToken(newUser.id, "15m");
            const refreshToken = generateToken(newUser.id, "7d");

            return {
                success: true,
                message: "User registered successfully",
                accessToken,
                refreshToken,
                user: newUser,
            };
        },

        login: async (_: any, { email, password }: any) => {
            const user = await userRepo.findOne({ where: { email } });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new AuthenticationError("Invalid credentials");
            }

            const accessToken = generateToken(user.id, "15m");
            const refreshToken = generateToken(user.id, "7d");

            return {
                success: true,
                message: "Login successful",
                accessToken: accessToken,
                refreshToken: refreshToken,
                user,

            };
        },

        refreshToken: async (_: any, { token }: any) => {
            try {
                const decoded: any = verifyToken(token);
                return {
                    success: true,
                    message: "Token refreshed successfully",
                    accessToken: generateToken(decoded.userId, "15m"),
                };
            } catch {
                throw new AuthenticationError("Invalid or expired refresh token");
            }
        },

        sendMessage: async (_: any, { receiverId, content }: any, context: any) => {
            if (!context.user) throw new AuthenticationError("Not authenticated");

            // console.log("Context User:", context.user);

            if (!content || content.trim() === "") {
                throw new UserInputError("Message content cannot be empty");
            }

            const sender = await userRepo.findOne({ where: { id: context.user.userId } });
            if (!sender) throw new AuthenticationError("Sender not found");

            const receiver = await userRepo.findOne({ where: { id: receiverId } });
            if (!receiver) throw new UserInputError("Receiver not found");

            // Create and save message
            const message = messageRepo.create({
                content,
                sender,
                receiver,
                createdAt: new Date().toISOString(),
            });

            await messageRepo.save(message);

            console.log("Message saved:", message);

            return message;
        },

    },
};
