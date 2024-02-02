import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

const options: cors.CorsOptions = {
    methods: "GET, OPTIONS, PUT, POST, DELETE",
    origin: "*"
}

app.use(cors(options));
app.use(express.json());

interface Room {
    users: Record<string, string>;
}

const rooms: Record<string, Room> = {};

app.post('/createRoom', (req: Request, res: Response) => {
    const roomId = uuidv4();
    rooms[roomId] = { users: {} };
    res.status(200).json({ roomId, message: 'Sala criada com sucesso.' });
});

io.on('connection', (socket) => {

    socket.on('joinRoom', (roomId: string, username: string) => {
        socket.join(roomId);

        if (!rooms[roomId]) {
            rooms[roomId] = { users: {} };
        }

        rooms[roomId].users[socket.id] = username;

        io.to(roomId).emit('roomUsers', Object.values(rooms[roomId].users));

    });

    socket.on('sendMessage', (roomId: string, message: string) => {
        io.to(roomId).emit('message', { username: rooms[roomId].users[socket.id], message });
    });

    socket.on('disconnect', () => {

    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});

