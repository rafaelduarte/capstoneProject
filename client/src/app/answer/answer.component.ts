import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css'],
})
export class AnswerComponent implements OnInit {
  // ICON
  faCross = faTimesCircle;

  saveAnswerForm!: FormGroup;
  saveEditAnswerForm!: FormGroup;
  isAnswerParam: boolean = false;
  questionId: any;
  answerId: any;
  question: any;
  tempData: any;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.questionId = this.route.snapshot.paramMap.get('questionId');
    this.answerId = this.route.snapshot.paramMap.get('answerId');

    this.saveAnswerForm = this.formBuilder.group({
      text: '',
    });
    //Edit Answer Form
    this.saveEditAnswerForm = this.formBuilder.group({
      text: '',
    });

    if (this.answerId) {
      this.isAnswerParam = true;
    }
    this.fetchAnswer();
    this.fetchQuestion();
  }

  saveAnswer() {
    this.dataService
      .saveAnswer(this.questionId, this.saveAnswerForm.value)
      .subscribe((res) => {});
    this.router.navigateByUrl(`/questions/${this.questionId}`);
  }

  fetchAnswer() {
    this.dataService.getAnswers().subscribe((data) => {
      this.tempData = data.find((item) => {
        this.saveEditAnswerForm.patchValue({
          text: `${item.text}`,
        });
        return item._id === this.answerId;
      });
    });
  }
  saveEditedAnswer() {
    this.dataService
      .modifyAnswer(this.answerId, this.saveEditAnswerForm.value)
      .subscribe((res) => {});
    this.router.navigateByUrl(`/questions/${this.questionId}`);
  }

  fetchQuestion() {
    this.dataService.getSingleQuestion(this.questionId).subscribe(
      (data) => {
        this.question = data;
      },
      (error) => {
        if (error.status === 400) {
          this.router.navigateByUrl('**');
        }
      }
    );
  }
}
