import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { environment } from '../../environments/environment.development';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

interface ResponseCreateRoom { roomId: string, message: string }

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [MatProgressBarModule, MatButtonModule, MatCardModule, HttpClientModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss'
})
export class HomeComponent {

	loading: boolean = false;
	http = inject(HttpClient);
	router = inject(Router);
	env = environment;

	createRoom() {
		this.loading = true;
		const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
		this.http.post<ResponseCreateRoom>(this.env.ApiUrl + '/createRoom', headers)
			.pipe(finalize(() => this.loading = false))
			.subscribe(
				response => this.responseServer(response),
				err => console.log(err));
	}

	private responseServer(res: ResponseCreateRoom) {
		this.router.navigate([`/room/${res.roomId}`]);
	}
}
