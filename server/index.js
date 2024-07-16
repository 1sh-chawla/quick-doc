
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getDocument, updateDocument } from './controllers/documentController.js';
import dotenv from 'dotenv';
import Connection from './database/db.js';
dotenv.config();

URL = process.env.MONGO_URI;
Connection(URL);

const PORT = process.env.PORT || 9000;
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

httpServer.listen(PORT, () => {
    console.log(`Socket.io server running on port ${PORT}`);
});

io.on('connection', socket => {
    socket.on('get-document', async documentId => {
        const data = "";
        const document = await getDocument(documentId);
        socket.join(documentId);
        socket.emit('load-document', document.data);

        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        });

        socket.on('save-document', async data => {
            await updateDocument(documentId, data);
        });
    });
});