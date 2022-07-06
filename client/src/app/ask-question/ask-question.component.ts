import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../auth/authentication.service';
import { DataService } from '../services/data.service';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.css'],
})
export class AskQuestionComponent implements OnInit {
  // ICONS
  faCross = faTimesCircle;

  saveQuestionForm!: FormGroup;
  userId: any;
  questionId: any;
  isQuestionParam: boolean = false;
  question: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.saveQuestionForm = this.formBuilder.group({
      title: '',
      text: '',
    });

    this.questionId = this.route.snapshot.paramMap.get(`questionId`);
    this.userId = this.authService.getUserId();
    if (this.questionId) {
      this.isQuestionParam = true;
      this.fetchQuestion();
    }
  }

  saveQuestion(): void {
    this.dataService
      .postQuestion(this.userId, this.saveQuestionForm.value)
      .subscribe((res) => {
        //console.log(res);
      });
    this.router.navigateByUrl('/questions');
  }

  saveEditQuestion() {
    this.dataService
      .editQuestion(this.questionId, this.saveQuestionForm.value)
      .subscribe(
        (res) => {},
        (error) => {
          if (error.status === 400) {
            this.router.navigateByUrl('**');
          }
        }
      );
    this.router.navigateByUrl(`/questions/${this.questionId}`);
  }

  fetchQuestion() {
    this.dataService.getSingleQuestion(this.questionId).subscribe(
      (data) => {
        this.question = data;
        this.saveQuestionForm.patchValue({
          title: `${this.question.title}`,
          text: `${this.question.text}`,
        });
      },
      (error) => {
        if (error.status === 400) {
          this.router.navigateByUrl('**');
        }
      }
    );
  }
}
