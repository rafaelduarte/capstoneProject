import { Component, OnInit } from '@angular/core';
import { owner, questions } from '../models/questions.model';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public Questions?: questions[];

  constructor(private dataService: DataService) {}

  private getQuestions() {
    this.dataService.getQuestions().then((data) => {
      this.Questions = data;
      // var user = data.map((resp) => resp.owner);
      // var names = Object.keys(user).map((key:any) => user[key].name);
      console.log(this.Questions);
    });
  }

  ngOnInit(): void {
    this.getQuestions();
  }
}
