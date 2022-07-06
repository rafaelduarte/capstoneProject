import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { answers, questions } from '../models/question.model';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { InterceptorSkipHeader } from '../auth/auth-interceptor.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private SERVER_API = 'http://localhost:3000';
  private GET_QUESTION_API = `${this.SERVER_API}/api/questions`;

  constructor(private http: HttpClient, private router: Router) {}

  //GET response deseralize JSON object into interface Type
  public getAnswers(): Observable<answers[]> {
    return this.http.get<answers[]>(this.SERVER_API + '/api/answers').pipe(
      switchMap((answer) => {
        //console.log(answer);
        return of(answer as answers[]);
      }),
      catchError((e) => {
        console.error('Server error log: ', e.error);
        return throwError('Answers not found due to server error.');
      })
    );
  }

  //Fetch User Profile
  public getUserProfile(userId: string) {
    return this.http.get(this.SERVER_API + '/api/' + userId + '/profile').pipe(
      switchMap((user) => {
        return of(user);
      }),
      catchError((e) => {
        console.error(e.error);
        return throwError('Failed to fetch user profile');
      })
    );
  }

  //Update User Profile
  public updateUser(userid: string, user: User) {
    return this.http.put(`${this.SERVER_API}/api/${userid}/updateUser`, user);
  }

  //Fetch Questions
  public getQuestions(): Observable<questions[]> {
    return this.http
      .get<questions[]>(this.GET_QUESTION_API, {
        headers: InterceptorSkipHeader,
      })
      .pipe(
        switchMap((questions) => {
          return of(questions);
        })
      );
  }

  //Fetch Single Question
  public getSingleQuestion(questionid: string): Observable<questions[]> {
    return this.http
      .get<questions[]>(this.GET_QUESTION_API + '/' + questionid)
      .pipe(
        switchMap((question) => {
          return of(question);
        })
      );
  }

  //Create a Question
  public postQuestion(userid: string, data: any): Observable<any> {
    //console.log(data);
    return this.http.post<any>(
      `${this.SERVER_API}/api/${userid}/askQuestion`,
      data
    );
  }

  //Like a Question
  public likeQuestion(questionId: String) {
    const data = { id: questionId };
    return this.http.put(
      `${this.SERVER_API}/api/${questionId}/likeQuestion`,
      data
    );
  }

  //Dislike a Question
  public unlikeQuestion(questionId: String) {
    const data = { id: questionId };
    return this.http.put(
      `${this.SERVER_API}/api/${questionId}/unlikeQuestion`,
      data
    );
  }

  //Modify a Question
  public editQuestion(questionId: string, data: any) {
    return this.http.put(
      `${this.SERVER_API}/api/${questionId}/editQuestion`,
      data
    );
  }

  //Create a Answer
  public saveAnswer(questionid: string, data: any): Observable<any> {
    //console.log(data);
    return this.http.post<any>(
      `${this.SERVER_API}/api/questions/${questionid}/giveAnswer`,
      data
    );
  }

  //Modify an Answer
  public modifyAnswer(answerId: string, data: any) {
    return this.http.put(`${this.SERVER_API}/api/${answerId}/editAnswer`, data);
  }

  //Handle Errors
  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        console.error('Error Event');
      } else {
        //console.error(`error status: ${e.status} ${e.statusText}`);
        switch (error.status) {
          case 400: //wrong credentials
            console.error('Bad Request');

            this.router.navigateByUrl('/questions');
            break;
        }
      }
    }
    return Promise.reject(error.message || error);
  }
}
