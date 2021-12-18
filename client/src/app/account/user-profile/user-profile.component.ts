import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { CustomvalidationService } from 'src/app/services/customvalidation.service';
import { DataService } from 'src/app/services/data.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  currentUser: any;
  totalQuestions: any = 0;
  totalAnswers: any = 0;
  isEdit = false;
  form!: FormGroup;
  constructor(
    private authService: AuthenticationService,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private customValidator: CustomvalidationService
  ) {}

  ngOnInit(): void {
    this.getUser(this.authService.getUserId());

    this.form = this.formBuilder.group({
      name: [{ value: '' }, Validators.required],
      email: [{ value: '' }, [Validators.required, Validators.email]],
      username: ['', Validators.required],
      dob: ['', Validators.required],
      bio: ['', Validators.required],
    });
  }

  getUser(id: any) {
    this.dataService.getUser(id).subscribe(
      (user) => {
        this.currentUser = user;
        this.countFields(this.currentUser, 'questions');
        this.countFields(this.currentUser, 'answer');
      },
      (error) => {}
    );
  }

  countFields(user: any, field: string) {
    //If count is questions
    if ((field = 'questions ')) {
      let userData = user.questions;
      //console.log(userData);
      if (userData.length <= 0) {
        console.log(`No ${field} here.`);
      } else {
        let tempFieldData = Array();
        for (let i = 0; i <= userData.length; i++) {
          let fieldArray = tempFieldData.push(userData[i]);
        }
        this.totalQuestions = tempFieldData.length - 1;
      }
    }

    //If count is answers
    if ((field = 'asnwers')) {
      this.dataService.getAnswers().subscribe((data) => {
        let fieldData = data;
        let answersUserId = Array();

        for (let i = 0; i <= data.length; i++) {
          if (fieldData[i]?.author._id == this.authService.getUserId()) {
            let tempAnswersUserId = answersUserId.push(
              fieldData[i]?.author._id
            );
            //console.log(answersUserId.length);
            this.totalAnswers = answersUserId.length;
          }
        }
        //console.log(answersUserId);
      });
    }
  }

  submit(): void {
    this.dataService
      .updateUser(this.authService.getUserId(), this.form.value)
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
