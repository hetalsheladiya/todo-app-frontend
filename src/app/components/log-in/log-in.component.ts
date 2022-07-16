import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  loginForm: any = FormGroup
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private alert: AlertService
  ) { 
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  ngOnInit(): void {
  }

  login():void {
    this.userService.login(this.loginForm.value).subscribe({
      next: (data) => {   
        localStorage.setItem("token", data.token)
        if(data.data.usertype.usertype.indexOf("user") > -1)     
          this.router.navigate(["/todo-list"])
        else 
          this.router.navigate(["/home"])
      },
      error: (e) => {       
        if(Array.isArray(e.error.error))
          this.alert.openSnackBar(e.error.error[0].msg, 'Error!')
        else         
          this.alert.openSnackBar(e.error.error, 'Error!')       
      }
    })
  }

}
