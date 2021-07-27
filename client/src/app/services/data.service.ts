import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { questions } from '../models/questions.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private SERVER_API = 'http://localhost:3000';
  private GET_QUESTION_API = `${this.SERVER_API}/api/questions`;

  constructor(private http: HttpClient) {}

  public getQuestions(): Promise<questions[]> {
    return this.http
      .get(this.GET_QUESTION_API)
      .toPromise()
      .then((res) => res as questions[]);
  }
}
