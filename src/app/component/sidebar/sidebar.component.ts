import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    imports: [RouterLink, CommonModule],
    standalone: true,
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent {}
