import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SocketService } from '../socket.service';
import { ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';


@Component({
	selector: 'app-room',
	standalone: true,
	imports: [MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, CommonModule, MatCardModule],
	templateUrl: './room.component.html',
	styleUrl: './room.component.scss',
	providers: [SocketService]
})
export class RoomComponent implements OnDestroy, OnInit {
	roomId!: string;
	messages: any[] = [];
	roomUsers: any[] = [];
	private unsubscribe$ = new Subject();
	socketService = inject(SocketService);
	route = inject(ActivatedRoute);
	snackBar = inject(MatSnackBar);
	message = new FormControl<string>('', [Validators.required]);



	ngOnInit(): void {
		this.route.params.subscribe(params => {
			this.roomId = params['id'];
			this.joinRoom();
		});
		this.socketService.onRoomUser()
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe(users => {
				this.roomUsers = users as any[];
			});

		this.socketService.onMessage()
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe(message => {
				this.messages.push(message);
			});

		this.socketService.onDisconnect()
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe(() => {
				console.log('onDisconnect...')
			});
	}

	joinRoom() {
		this.socketService.joinRoom(this.roomId, 'não informado');
	}

	sendMessage() {
		if (this.isValid()){
			this.socketService.sendMessage(this.roomId, this.message?.value || '');
			this.message.reset();
		}
	}

	private isValid(): boolean {
		if (!this.message.valid)
			this.snackBar.open('Escreva algo', 'Atenção');
		return this.message.valid;
	}


	ngOnDestroy(): void {
		this.unsubscribe$.unsubscribe();
	}
}
