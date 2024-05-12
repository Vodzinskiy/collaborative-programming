import {Component} from '@angular/core';
import {env} from "../../../../environments/environment";

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html'
})
export class SocialLoginComponent {
  socialLogin(provider: string) {
    window.location.href = env.API_URL.slice(0, -4) + 'oauth2/authorization/' + provider;
  }
}
