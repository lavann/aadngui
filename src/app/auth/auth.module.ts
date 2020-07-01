import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MsalModule,
  MsalInterceptor,
  MSAL_CONFIG,
  MSAL_CONFIG_ANGULAR,
  MsalService,
  MsalAngularConfiguration,
  BroadcastService
} from '@azure/msal-angular'
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Configuration } from 'msal';

export const protectedResourceMap: [string, string[]][] = [
  ['https://graph.microsoft.com/v1.0/me', ['user.read']]
  , ['https://localhost:5001/api/weatherforecast', ['api://ae05da8f-07d0-4ae6-aef1-18a6af68e5dd/access_as_user']]
];

function MSALConfigFactory(): Configuration {
  return {
    auth: {
      clientId: 'eba23c0b-1e86-4f68-b1d2-9c54d96083de'
      , authority: 'https://login.microsoftonline.com/1c302616-bc6a-45a6-9c07-838c89d55003'
      , redirectUri: 'http://localhost:4200'
      , validateAuthority: true
      , postLogoutRedirectUri: 'http://localhost:4200'
      , navigateToLoginRequestUrl: true
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false //set to false, not ie 11
    }
  };
}

function MSALAngularConfigFactory(): MsalAngularConfiguration {
  return {
    popUp: false //not ie
    , consentScopes: [
      'user.read'
      , 'openid'
      , 'profile'
      , 'api://ae05da8f-07d0-4ae6-aef1-18a6af68e5ddd/access_as_user'
    ],
    unprotectedResources: ['https://www.microsoft.com']
    , protectedResourceMap: protectedResourceMap
    , extraQueryParameters: {}
  }
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MsalModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS
      , useClass: MsalInterceptor
      , multi: true
    },
    {
      provide: MSAL_CONFIG
      , useFactory: MSALConfigFactory
    },
    {
      provide: MSAL_CONFIG_ANGULAR
      , useFactory: MSALAngularConfigFactory
    },
    BroadcastService, MsalService
  ]
})
export class AuthModule { }
