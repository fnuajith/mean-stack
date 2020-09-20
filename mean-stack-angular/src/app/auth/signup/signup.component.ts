import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

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

  onSignup(signUpForm: NgForm): void{
    console.log(signUpForm.value);
    if (signUpForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(signUpForm.value.emailId, signUpForm.value.password);
  }

  ngOnDestroy(): void {
    this.authServiceSubscription.unsubscribe();
  }

}
