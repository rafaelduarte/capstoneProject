import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../auth/authentication.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css'],
})
export class AskQuestionComponent implements OnInit {
  askQuestionForm!: FormGroup;
  public id: any;
  private isParam: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.askQuestionForm = this.formBuilder.group({
      title: '',
      text: '',
    });

    this.id = this.route.snapshot.paramMap.get('userid');
    if (this.id) {
      this.isParam = true;
    }
  }

  askQuestion(): void {
    let title = this.askQuestionForm.controls['title'].value;
    let text = this.askQuestionForm.controls['text'].value;
    if (title && text) {
      this.dataService.postQuestion(this.id, title, title).subscribe((res) => {
        console.log(res);
      });
    }
  }

  buttonWorking(): void {
    console.log('Button Click');
  }
}
