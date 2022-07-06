import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth/authentication.service';
import { owner, questions } from '../models/question.model';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public Questions!: questions[];
  user!: string;
  public answersQuestionId: Array<String> = [];
  public totalAnswers: any = 0;
  constructor(
    private dataService: DataService,
    private authservice: AuthenticationService
  ) {}

  private getQuestions() {
    this.dataService.getQuestions().subscribe((data) => {
      this.Questions = data;
      this.Questions.sort((a, b) => {
        return b.likes - a.likes;
      });
    });
  }

  ngOnInit(): void {
    this.getQuestions();
    this.user = this.authservice.getUserId();
  }
}
