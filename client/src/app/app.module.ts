import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe } from '@angular/common';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppComponent } from './app.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { HomeComponent } from './home/home.component';
import { QuestionComponent } from './question/question.component';
import { AuthenticationService } from './auth/authentication.service';
import { UserProfileComponent } from './account/user-profile/user-profile.component';
import { NavComponent } from './nav/nav.component';
import { AuthGuard } from './auth/auth.guard';
import { AnswerComponent } from './answer/answer.component';
import { AskQuestionComponent } from './ask-question/ask-question.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

import { CommaSeperatorPipe } from './comma-seperator.pipe';
import { AboutUsComponent } from './about-us/about-us/about-us.component';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterPipe } from './services/filter.pipe';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

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
    path: 'questions/:questionId/giveAnswer',
    component: AnswerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'askQuestion',
    component: AskQuestionComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: ':questionId/editQuestion',
    component: AskQuestionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'question/:questionId/:answerId/editAnswer',
    component: AnswerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    pathMatch: 'full',
    component: PageNotFoundComponent,
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
    CommaSeperatorPipe,
    AboutUsComponent,
    FilterPipe,
    PageNotFoundComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    FontAwesomeModule,
    MatProgressBarModule,
    BrowserAnimationsModule,
  ],
  providers: [
    RegisterComponent,
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
