import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken';

  login(credentials: { email: string; password: string }) {
    return fetch('https://api.tvmax.ec/api/get-user/1UliJqH6oNuZEk6l72r7alxHe5QOyYGS6ZzS8NtyfYP4/materiales-fibramax-65bb0c225f90.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status== true) {
          console.log("data", data);
          console.log("user", data.username);
          sessionStorage.setItem(this.tokenKey, data.rol);
          sessionStorage.setItem('userName', data.usernaame);
          return true;
        }
        return false;
      });
  }

  logout() {
    sessionStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return typeof window !== 'undefined' && !!sessionStorage.getItem(this.tokenKey);
  }
}
