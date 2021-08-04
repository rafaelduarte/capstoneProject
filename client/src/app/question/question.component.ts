import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { questions } from '../models/question.model';
import { DataService } from '../services/data.service';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {
  questions!: questions[];
  public isParam: boolean = false;
  public id: any;
  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  faEdit = faEdit;
  ngOnInit(): void {
    //Check URL Parameter for ID
    this.id = this.route.snapshot.paramMap.get('questionid');
    if (this.id) {
      this.isParam = true;
      //API Calls
      this.getQuestionById(this.id);
    } else {
      //API Calls
      this.getAllQuestions();
    }

    //Console Logs
    //console.log(this.isParam);
    //console.log(typeof this.questions);
  }

  private getAllQuestions() {
    this.dataService.getQuestions().then((data) => {
      this.questions = data;
    });
  }
  private getQuestionById(id: any) {
    console.log('Sending GET request');
    this.dataService.getSingleQuestion(id).then((data) => {
      this.questions = data;
      console.log();
      console.log(data);
    });
    console.log('GET Request Sent');
  }
}
