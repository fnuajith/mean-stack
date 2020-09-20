import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  authServiceSubscription: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authServiceSubscription = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      }
    );
  }

  onLogin(loginForm: NgForm): void{
    console.log(loginForm.value);
    if (loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(loginForm.value.emailId, loginForm.value.password);
  }

  ngOnDestroy(): void {
    this.authServiceSubscription.unsubscribe();
  }

}
