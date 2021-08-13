import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css'],
})
export class AnswerComponent implements OnInit {
  saveAnswerForm!: FormGroup;
  public isParam: boolean = false;
  public id: any;
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('questionid');
    this.saveAnswerForm = this.formBuilder.group({
      text: '',
    });
    if (this.id) {
      this.isParam = true;
    }
  }

  saveAnswer() {
    this.dataService
      .saveAnswer(this.id, this.saveAnswerForm.value)
      .subscribe((res) => {
        console.log(res);
      });
    this.router.navigateByUrl(`/questions/${this.id}`);
  }
}
