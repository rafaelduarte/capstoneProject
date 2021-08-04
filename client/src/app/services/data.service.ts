import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { questions } from '../models/question.model';
import { map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private SERVER_API = 'http://localhost:3000';
  private GET_QUESTION_API = `${this.SERVER_API}/api/questions`;

  constructor(private http: HttpClient, private router: Router) {}

  public getQuestions(): Promise<questions[]> {
    return this.http
      .get(this.GET_QUESTION_API)
      .toPromise()
      .then((res) => res as questions[]);
  }

  public getSingleQuestion(questionid: string): Promise<questions[]> {
    return this.http
      .get(this.GET_QUESTION_API + '/' + questionid)
      .toPromise()
      .then((res) => res as questions[]);
  }

  public postQuestion(
    userid: string,
    title: string,
    text: string
  ): Observable<any> {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('text', text);
    return this.http.post<any>(
      `${this.SERVER_API}/api/${userid}/askQuestion`,
      postData
    );
    // return this.http
    //   .post<questions>(`${this.SERVER_API}/api/${userid}/askQuestion`, postData)
    //   .subscribe((data) => {
    //     console.log(data);
    //   });
  }
}
