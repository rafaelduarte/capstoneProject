import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe } from '@angular/common';

import { AppComponent } from './app.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { HomeComponent } from './home/home.component';
import { QuestionComponent } from './question/question.component';
import { AuthenticationService } from './auth/authentication.service';
import { UserProfileComponent } from './account/user-profile/user-profile.component';
import { NavComponent } from './nav/nav.component';
import { AuthGuard } from './auth/auth.guard';
import { AnswerComponent } from './account/answer/answer.component';
import { AskQuestionComponent } from './ask-question/ask-question.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'questions',
    component: QuestionComponent,
  },
  {
    path: 'questions/:questionid',
    component: QuestionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'questions/:questionid/giveAnswer',
    component: AnswerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'askQuestion',
    component: AskQuestionComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    QuestionComponent,
    UserProfileComponent,
    NavComponent,
    AnswerComponent,
    AskQuestionComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    FontAwesomeModule,
  ],
  providers: [
    AuthenticationService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS, multi: true },
    JwtHelperService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
