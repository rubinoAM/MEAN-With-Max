import { Component } from '@angular/core';

@Component({
    templateUrl:'./error.component.html'
})
export class ErrorComponent {
    message:string = "An unknown error has occurred."
}