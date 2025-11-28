import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: {origin: '*'}});

let boxes = [];

setInterval(() => {
  boxes.forEach(box => {
    box.x += box.x > box.targetX ? -1 : +1;
    box.y += box.y > box.targetY ? -1 : +1;
    
  });
  io.emit('all', boxes);
}, 50);

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`);
  
  socket.emit('id', socket.id);
  boxes.push({ id: socket.id, x: 0, y: 0, targetX: 0, targetY: 0 });
  socket.emit('all', boxes);

  socket.on('movebox', (box) => {
    const target = boxes.find(x => x.id === box.id);
    console.log('move', target);
    if(target) {
      target.targetX = box.targetX;
      target.targetY = box.targetY;
      io.emit('box', `box ${target.id} to x: ${box.targetX}, y: ${box.targetY}`);
    }
    else {
      io.emit('message', `box ${box.id} not found`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
    boxes = boxes.filter(x => x.id !== socket.id);
    io.emit('all', boxes);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});