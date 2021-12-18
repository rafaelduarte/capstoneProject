import { HttpClient } from '@angular/common/http';
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

  public getQuestions(): Promise<questions[]> {
    return this.http
      .get(this.GET_QUESTION_API, { headers: InterceptorSkipHeader })
      .toPromise()
      .then((res) => res as questions[])
      .catch(this.handleError);
  }

  public getSingleQuestion(questionid: string): Promise<questions[]> {
    return this.http
      .get(this.GET_QUESTION_API + '/' + questionid)
      .toPromise()
      .then((res) => res as questions[]);
  }

  //GET response deseralize JSON object into interface Type
  public getAnswers() {
    return this.http.get<answers[]>(this.SERVER_API + '/api/answers').pipe(
      switchMap((answer) => {
        return of(answer as answers[]);
      }),
      catchError((e) => {
        console.log('Server error log: ', e.error);
        return throwError('Answers not found due to server error.');
      })
    );
  }

  public getUser(userId: string) {
    return this.http.get(this.SERVER_API + '/api/' + userId + '/profile').pipe(
      switchMap((user) => {
        return of(user);
      }),
      catchError((e) => {
        console.log(e.error);
        return throwError('Failed to fetch user profile');
      })
    );
  }

  public postQuestion(userid: string, data: any): Observable<any> {
    // const postData = new FormData();
    // postData.set('title', title);
    // postData.set('text', text);

    console.log(data);
    return this.http.post<any>(
      `${this.SERVER_API}/api/${userid}/askQuestion`,
      data
    );
  }

  public saveAnswer(questionid: string, data: any): Observable<any> {
    console.log(data);
    return this.http.post<any>(
      `${this.SERVER_API}/api/questions/${questionid}/giveAnswer`,
      data
    );
  }

  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }

  public likeQuestion(questionId: String) {
    const data = { id: questionId };
    return this.http.put(
      `${this.SERVER_API}/api/${questionId}/likeQuestion`,
      data
    );
  }

  public unlikeQuestion(questionId: String) {
    const data = { id: questionId };
    return this.http.put(
      `${this.SERVER_API}/api/${questionId}/unlikeQuestion`,
      data
    );
  }

  public updateUser(userid: string, user: User) {
    return this.http.put(`${this.SERVER_API}/api/${userid}/updateUser`, user);
  }
}
