import { Injectable, signal } from '@angular/core';
import { Box } from './box.models';
import { io, Socket } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class BoxService {
  $boxes = signal<Box[]>([], { equal: () => false });
  $id = signal<string>('');
  private $message = signal<string | null>(null);
  private socket?: Socket;
  // private animate;

  connect() {
    this.socket = io('http://localhost:3000');
    
    this.socket.on('id', (id: string) => {
        this.$id.set(id);
    });

    this.socket.on('message', (message: string) => {
        this.$message.set(message);
    });

    this.socket.on('all', (boxes: Box[]) => {
        this.$boxes.set(boxes);
    });

    this.socket.on('updated', (box: Box) => {
      this.$boxes.update(xs => xs.filter(x => x.id !== box.id).concat(box));
    });

    this.socket.on('removed', (boxId: string) => {
      this.$boxes.update(xs => xs.filter(x => x.id !== boxId));
    });

    setInterval(() => {
      const boxes = this.$boxes();
      boxes.forEach(x => {
        x.x += x.x < x.targetX ? 3 : -3;
        x.y += x.y < x.targetY ? 3 : -3;
      });
      this.$boxes.set(boxes);
    }, 50);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  public move(box: Box) {
    console.log(box.targetX, box.targetY)
      this.socket?.emit('move', box);
  }

  static generateRandomColor(){
  const digits = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f']

  let hexCode = "#" 

  while( hexCode.length < 7 ){
    hexCode += digits[ Math.round( Math.random() * digits.length ) ]
  }

  return hexCode 
}
}
