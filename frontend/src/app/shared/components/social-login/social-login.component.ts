import {Component} from '@angular/core';
import {env} from "../../../../environments/environment";

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html'
})
export class SocialLoginComponent {
  socialLogin(provider: string) {
    window.location.href = env.API_URL + 'oauth2/authorization/' + provider;
  }
}
