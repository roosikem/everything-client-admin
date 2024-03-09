import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as AWS from 'aws-sdk/global';
import { environment } from "../../../environments/environment";
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { Observable } from "rxjs";
import { AuthStateModel } from "../state/auth.state";
import { CognitoUserSession } from "amazon-cognito-identity-js";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  
  clientId = environment.C_ID;
  UserPoolId = environment.UP_ID;
  region = environment.RG;
  cognitoUser;
  sessionUserAttributes;
  poolData;
  userPool;
  public newPasswordEvent: EventEmitter<boolean> = new EventEmitter();
  constructor(private http: HttpClient) {
    this.poolData = {
      UserPoolId: this.UserPoolId,
      ClientId: this.clientId,
    };
    this.userPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolData);
  }
  cognitoUserGlobal: AmazonCognitoIdentity.CognitoUser;
  login(username:string, password: string): Observable<AuthStateModel> {
    var username = username;

    var password = password;
    var newpw = password;
    var cognitoUser;

    var iduserpool = "us-east-1:0056cb79-c7fe-4ccf-a72e-7da5577ff429";

    var authenticationData = {
      Username: username,
      Password: password,
    };
     var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
       authenticationData
     );

    var userData = {
      Username: username,
      Pool: this.userPool,
    };
    cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    this.cognitoUserGlobal = cognitoUser;
    return new Observable<any>(obs => {
      try {
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: function (result: CognitoUserSession) {
            console.log(result);
            var accessToken = result.getAccessToken().getJwtToken();
            AWS.config.region = this.RG;

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              IdentityPoolId: iduserpool, // your identity pool id here
              Logins: {
                'cognito-idp.us-east-1.amazonaws.com/us-east-1_JuLXg3NYO': accessToken,
              },
            });

            obs.next({
              email: username, token: result.getIdToken(),
              access_token: accessToken,
              permissions: []
            });
            obs.complete();
          },

          onFailure: function (err) {
            obs.error(err);
            alert(err.message || JSON.stringify(err));
            obs.complete();
          },
          newPasswordRequired: function (userAttributes, requiredAttributes) {
            delete userAttributes.email_verified;
            delete userAttributes.email;
            cognitoUser.completeNewPasswordChallenge(newpw, userAttributes, this)
          },
        });
      } catch (e) {
        obs.error(e);
        obs.complete();
      }
    });

  }

  // handleNewPassword(newPassword, user: AmazonCognitoIdentity.CognitoUser) {
  //   user.completeNewPasswordChallenge(newPassword, {email :'manishkprj112@gmail.com'} );
  // }

  validateSession(): Observable<Boolean> {
   
    return new Observable<any>(obs => {
      try {
        var cognitoUserPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolData);
        var cognitoUser = cognitoUserPool.getCurrentUser();
        if (cognitoUser) {
          cognitoUser.getSession(function (err, session) {
            if (err) {

              obs.next(false);
              obs.complete();
            } else {
              console.log(session);
              obs.next(true);
              obs.complete();
            }

            //const accessToken = session.getAccessToken().getJwtToken();
            // You can also get idToken or refreshToken if needed
          });
        } else {
          obs.next(false);
          obs.complete();
        }
      } catch (e) {
        console.error(e);
        obs.next(false);
        obs.complete();
      }


    })

  }

  logout(): Observable<Boolean> {
    return new Observable<any>(obs => {
      try {
       var cognitoUserPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolData);
        var cognitoUser = cognitoUserPool.getCurrentUser();
        if (cognitoUser) {
          obs.next(true);
          obs.complete();
        } else {
          obs.next(false);
          obs.complete();
        }
      } catch (e) {
        console.error(e);
        obs.next(false);
        obs.complete();
      }


    })
  }
}
