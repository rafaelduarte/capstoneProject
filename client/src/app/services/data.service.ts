import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { questions } from '../models/question.model';
import { map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { InterceptorSkipHeader } from '../auth/auth-interceptor.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private SERVER_API = 'https://q-ans.herokuapp.com/';
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
}
