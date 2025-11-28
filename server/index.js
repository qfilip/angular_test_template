import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: {origin: '*'}});

let boxes = [];

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`);
  
  socket.emit('id', socket.id);
  boxes.push({ id: socket.id, x: 0, y: 0, targetX: 0, targetY: 0 });
  socket.emit('all', boxes);

  socket.on('move', (box) => {
    let target = boxes.find(x => x.id === box.id);
    console.log('move', target);
    if(target) {
      boxes = boxes.filter(x => x.id !== box.id).concat(box);
      target = box;
      io.emit('updated', box);
    }
    else {
      io.emit('message', `box ${box.id} not found`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
    boxes = boxes.filter(x => x.id !== socket.id);
    io.emit('removed', socket.id);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});