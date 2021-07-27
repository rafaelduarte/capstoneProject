import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { questions } from '../models/questions.model';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {
  public questions!: questions[];
  public isParam: boolean = false;
  public id: any;
  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public getQuestions() {
    this.dataService.getQuestions().then((data) => {
      this.questions = data;
    });
  }

  ngOnInit(): void {
    this.getQuestions();
    this.id = this.route.snapshot.paramMap.get('questionid');

    if (this.id) {
      this.isParam = true;
    }
    console.log(this.isParam);
    //console.log(this.getQuestions());
  }
}
