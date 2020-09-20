import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserAuthenticated = false;
  private authenticationSubscription: Subscription;

  constructor(private authService: AuthService) { }

  onLogOut(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getIsAuthenticated();
    this.authenticationSubscription = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy(): void {
    this.authenticationSubscription.unsubscribe();
  }

}
