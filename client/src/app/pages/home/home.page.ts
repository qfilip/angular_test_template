import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css'
})
export class HomePage {
  private router = inject(Router)

  goto = (route: string) => this.router.navigate([route]); 
}
