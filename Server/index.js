import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRouter from "./routes/user.routes.js";
import companyRouter from "./routes/company.routes.js";
import jobRouter from "./routes/job.routes.js";
import applicantionRouter from "./routes/application.routes.js";
import matchRouter from "./routes/match.routes.js";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

dotenv.config({});

const app = express();

connectDB()

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS policy: Origin ${origin} not allowed`));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));

app.get("/",(req,res)=>{
    res.send("Welcome to the server");
})

const PORT = process.env.PORT || 8001;

const server = createServer(app);
const io = new Server(server, {
    cors: corsOptions,
});

// Socket.io authentication middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        socket.userId = decoded.userId;
        socket.role = decoded.role;
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.userId);
    });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicantionRouter);
app.use("/api/v1/match", matchRouter);

// Export io for use in controllers
export { io };

server.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});


app.listen(PORT, () => {
    
    console.log(`Server running at port ${PORT}`);
})

// Triggers nodemon to restart and load the updated .env file
// Restarting for DB name fix
