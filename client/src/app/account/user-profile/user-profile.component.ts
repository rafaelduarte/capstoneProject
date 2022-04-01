import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { imageFile } from '../../models/file-upload';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { DataService } from 'src/app/services/data.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

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
  submitted: boolean = false;

  uploadProgress$!: Observable<number | undefined>;
  downloadUrl!: string;
  selectedFile!: FileList;
  currentFileUpload!: imageFile | undefined;
  percentage!: number;

  userObject!: User;
  constructor(
    private authService: AuthenticationService,
    private dataService: DataService, 
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseStorageService
  ) {}

  ngOnInit(): void {
    this.getUser(this.authService.getUserId());
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: [`${this.currentUser?.username}`, Validators.required],
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
        //console.log(`No ${field} here.`);
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
    let updatedData = this.form.value;
    this.userObject = updatedData;
    this.userObject.profile_pic = this.downloadUrl;

    console.log(this.userObject);
    this.dataService
      .updateUser(this.authService.getUserId(), this.userObject)
      .subscribe(
        (data) => {
          console.log(data);
          this.isEdit = false;
          window.location.reload();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  editToggle(): void {
    console.log(this.form.value);
    this.isEdit = true;
    this.getUser(this.authService.getUserId());
    this.downloadUrl = this.currentUser.profile_pic;
    // console.log('isEdit: ', this.isEdit);
    // console.log('isEdit: ', this.currentUser.dob);
    //Initialize default database values to the form inputs
    this.form.patchValue({
      name: `${this.currentUser.name}`,
      email: `${this.currentUser.email}`,
      username: `${this.currentUser.username}`,
      dob: `${this.currentUser.date_of_birth}`,
      bio: `${this.currentUser.bio}`,
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files;
    console.log(event.target.files.item(0));
  }

  upload() {
    this.submitted = true;
    const file: File = this.selectedFile.item(0) as File;
    console.log(file);
    this.currentFileUpload = new imageFile(file);
    console.log(this.currentFileUpload);
    const userName = this.currentUser.username;
    const mediaFolderPath = `Profile/${this.currentUser.email}/profileImage/`;
    const { uploadProgress$, downloadUrl$ } =
      this.firebaseService.uploadFileAndGetMetadata(
        this.currentFileUpload,
        mediaFolderPath,
        userName
      );
    downloadUrl$.subscribe((downloadUrl) => {
      console.log(downloadUrl);
      this.downloadUrl = downloadUrl;
    });
  }
}
