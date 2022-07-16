import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: any = FormGroup;
  userTypeList: any = []
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private alert: AlertService
  ) {     
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ["", [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      usertype: ["", Validators.required]
    })
  }

  ngOnInit(): void {   
    this.getAllUserTypeList()
  }

  getAllUserTypeList(): void {
    this.userService.getUserTypeList()
      .subscribe((data: any) => {         
        if(data.success) {
          this.userTypeList = data.data
        }             
      })
  } 

  register(): void {
    console.log(this.registerForm.value);  
    this.userService.signup(this.registerForm.value)
      .subscribe({
        next: (data) => {
          localStorage.setItem("token", data.token)
          if(data.data.usertype.usertype.indexOf("user") > -1)     
            this.router.navigate(["/todo-list"])
          else 
            this.router.navigate(["/home"])
        },
        error: (e) => {
          if(Array.isArray(e.error.errors))
          this.alert.openSnackBar(e.error.errors[0].msg, 'Error!')
          else         
            this.alert.openSnackBar(e.error.errors, 'Error!')
        }
      })  
  }

}
