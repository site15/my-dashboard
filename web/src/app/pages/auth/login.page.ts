import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [AsyncPipe, FormsModule, NgFor, DatePipe, NgIf],
  selector: 'app-login',
  template: `login`,
})
export default class LoginComponent {
}
