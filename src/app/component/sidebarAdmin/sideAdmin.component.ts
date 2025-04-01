import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-sideAdmin',
    imports: [RouterLink, CommonModule],
    standalone: true,
    templateUrl: './sideAdmin.component.html'
})
export class SideAdminComponent {}
