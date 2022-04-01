import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css'],
})
export class EditQuestionComponent implements OnInit {
  editQuestionForm!: FormGroup;
  public id: any;
  question: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.editQuestionForm = this.formBuilder.group({
      title: '',
      text: '',
    });
    this.id = this.route.snapshot.paramMap.get(`questionId`);
    //console.log(this.id);
    this.getQuestion(this.id);
  }
  getQuestion(id: string) {
    this.dataService.getSingleQuestion(id).then((data) => {
      this.question = data;
      console.log(data);
      this.editQuestionForm.patchValue({
        title: `${this.question.title}`,
        text: `${this.question.text}`,
      });
    });
  }

  editQuestion() {
    this.dataService
      .editQuestion(this.id, this.editQuestionForm.value)
      .subscribe((res) => {
        //console.log(res);
      });
    this.router.navigateByUrl(`/questions/${this.id}`);
  }
}
