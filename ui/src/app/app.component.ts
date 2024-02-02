import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [MatDividerModule, MatToolbarModule, CommonModule, RouterOutlet, HttpClientModule, ],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
	
	constructor(@Inject(PLATFORM_ID) private platformId: any) { }

	ngOnInit(): void {
		if (isPlatformBrowser(this.platformId)) {
			console.log(window.location.href)
		}
	}

}
