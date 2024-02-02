import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
	providedIn: 'root'
})
export class SocketService {

	constructor(
		private socket: Socket
	) { }

	joinRoom(roomId: string, username: string) {
		this.socket.emit('joinRoom', roomId, username);
	}

	sendMessage(roomId: string, message: string) {
		this.socket.emit('sendMessage', roomId, message);
	}

	onRoomUser() {
		return this.socket.fromEvent('roomUsers');
	}

	onMessage() {
		return this.socket.fromEvent('message');
	}

	onDisconnect() {
		return this.socket.fromEvent('disconnect');
	}

}
