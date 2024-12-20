import { TestBed } from '@angular/core/testing';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: AuthService;
  let authGuard: AuthGuard;

  const executeGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => 
      TestBed.runInInjectionContext(() => authGuard.canActivate(route, state));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, AuthGuard]
    });
    authService = TestBed.inject(AuthService);
    authGuard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
