import { Component, OnInit } from '@angular/core';
import { MsalService, BroadcastService } from '@azure/msal-angular';
import { Logger, CryptoUtils } from 'msal';
import { HttpClient } from '@angular/common/http';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'aad-ng-ui';
  isLoggedIn = false;
  profile: any;
  todos: any;

  constructor(private broadcastService: BroadcastService, public authService: MsalService, private httpClient: HttpClient) { }
  ngOnInit(): void {
    this.checkAccount();
    this.broadcastService.subscribe('msal:loginSuccess', () => { //subscribe to the login success event - call local method - can do extra stuff
      this.checkAccount();
    });

    this.authService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }
      console.log('Redirect Success: ', response.accessToken);
    });

    this.authService.setLogger(new Logger((logLevel, message, piiEnabled) => {
      console.log('MSAL Logging: ', message);
    }, {
      correlationId: CryptoUtils.createNewGuid(),
      piiLoggingEnabled: false
    }));
  }

  checkAccount() {
    this.isLoggedIn = !!this.authService.getAccount();
    console.log(!!this.authService.getAccount());
    if (this.isLoggedIn) {
      this.getProfile();
    };
  }

  login() {
    this.authService.loginRedirect();
  }

  logout() {
    this.authService.logout();
  }

  getProfile() {
    this.httpClient.get(GRAPH_ENDPOINT).subscribe(resposne => {
      this.profile = resposne;
    });
  }

  getWeather() {
    this.httpClient.get('https://localhost:5001/api/weatherforecast/current').subscribe(response => {
      console.log(response);
      this.todos = response;
    })
  }
}

/*
ERROR InteractionRequiredAuthError: AADSTS65001: The user or administrator has not consented to use the application with ID 'eba23c0b-1e86-4f68-b1d2-9c54d96083de' named 'your app registration for the ui'. Send an interactive authorization request for this user and resource.
Trace ID: b1d4b252-e666-40a6-b7f8-b41d3fc92200
Correlation ID: deb3a442-4d01-4782-990e-cdc60c80021b
Timestamp: 2020-06-22 11:42:05Z
    at InteractionRequiredAuthError.AuthError [as constructor] (http://localhost:4200/vendor.js:71049:28)
    at InteractionRequiredAuthError.ServerError [as constructor] (http://localhost:4200/vendor.js:71570:28)
    at new InteractionRequiredAuthError (http://localhost:4200/vendor.js:71507:28)
    at MsalService.push../node_modules/msal/lib-es6/UserAgentApplication.js.UserAgentApplication.saveTokenFromHash (http://localhost:4200/vendor.js:69427:25)
    at MsalService.push../node_modules/msal/lib-es6/UserAgentApplication.js.UserAgentApplication.processCallBack (http://localhost:4200/vendor.js:68983:29)
    at MsalService.push../node_modules/msal/lib-es6/UserAgentApplication.js.UserAgentApplication.handleAuthenticationResponse (http://localhost:4200/vendor.js:69035:14)
    at MsalService.<anonymous> (http://localhost:4200/vendor.js:68779:34)
    at step (http://localhost:4200/vendor.js:91004:23)
    at Object.next (http://localhost:4200/vendor.js:90985:53)
    at fulfilled (http://localhost:4200/vendor.js:90975:58)


Need to grant admin consetn for the api, throuhgh the ui app registrations
api permissions  - grant admin consent for default directory

*/