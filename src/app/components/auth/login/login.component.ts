import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Login } from '../../../shared/action/auth.action';
import { AuthState, AuthStateModel } from 'src/app/shared/state/auth.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  public form: FormGroup;
  @Select(AuthState.accessToken) auth$: Observable<AuthStateModel>;

  constructor(
    private store: Store,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    this.auth$.subscribe(res => {
      try{
      if(res) {
        this.router.navigate(['/dashboard']); 
        this.router.navigateByUrl('/dashboard'); 
      }
    }catch(e){
      console.log(e);
    }
    })
  }

  submit() {
    this.form.markAllAsTouched();
    if(this.form.valid) {
      this.store.dispatch(new Login(this.form.value)).subscribe({
          next: (res) =>{ 
            //this.router.navigateByUrl('/dashboard'); 
          }     
        }
      );
    }
  }
  
}
