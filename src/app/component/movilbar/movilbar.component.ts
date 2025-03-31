import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movilbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './movilbar.component.html',
})
export class movilbarComponent {}
