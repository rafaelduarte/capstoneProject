import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { questions } from '../models/question.model';
import { DataService } from '../services/data.service';
import { faEdit, faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { AuthenticationService } from '../auth/authentication.service';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {
  farHeart = farHeart;
  fasHeart = fasHeart;
  faEdit = faEdit;

  questions?: questions[];
  question: any;

  public isParam = false;
  public isAns = false;
  public isLiked = false;
  public isLikedByUser = false;
  public isAnsByCurrentUser = false;
  public isQuesByCurrentUser = false;

  public id: any;

  public totalAnswers = 0;
  public numberOfLikes = 0;
  isEdit: boolean = false;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.route.paramMap.subscribe((routeParam) => {
      this.id = routeParam.get('questionid');
      //console.log(routeParam);
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    //Check URL Parameter for ID
    this.booleanFalse();
    //console.log(this.id);
    if (this.id) {
      this.isParam = true;
      //API Calls
      this.getQuestionById(this.id);
    } else {
      //API Calls
      this.getAllQuestions();
    }
  }

  booleanFalse() {
    this.isAns = false;
    this.isLiked = false;
    this.isLikedByUser = false;
    this.isAnsByCurrentUser = false;
    this.isQuesByCurrentUser = false;
    this.totalAnswers = 0;
    this.numberOfLikes = 0;
  }

  //Get all questions
  private getAllQuestions() {
    this.dataService.getQuestions().subscribe(
      (data) => {
        this.questions = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //Get question when clicked
  private getQuestionById(id: any) {
    //console.log('Sending GET request');
    this.dataService.getSingleQuestion(id).subscribe(
      (data) => {
        this.question = data;

        //Check if questions has answers
        if (this.question.answers.length) {
          this.isAns = true;
        }

        //check if current user is the asker
        if (this.question?.owner._id === this.authService.getUserId()) {
          this.isAnsByCurrentUser = true;
          this.isQuesByCurrentUser = true;
        }

        //Check if current user has answered a question to display edit answer button
        if (this.isAns) {
          this.question.answers.find((id: any) => {
            if (id.author._id === this.authService.getUserId()) {
              id.isAnsByCurrentUser = true;
              this.isAnsByCurrentUser = true;
            }
          });
        }

        //Check if question is liked by current user
        if (this.question.likedBy.includes(this.authService.getUserId())) {
          this.isLikedByUser = true;
          this.isLiked = true;
        }

        if (this.question.likes) {
          this.numberOfLikes = this.question.likes;
        }
      },
      (error) => {
        if (error.status === 400) {
          //console.log(`Bad Request`);
          this.router.navigateByUrl('**');
        }
      }
    );
  }

  //Like button
  likeButton(id: string) {
    this.dataService.likeQuestion(id).subscribe((data) => {
      //console.log(data);
      this.isLiked = true;
      this.isLikedByUser = true;
      this.numberOfLikes++;
    });
  }

  //Unlike Button
  unlikeButton(id: string) {
    this.dataService.unlikeQuestion(id).subscribe((data) => {
      //console.log(data);
      this.isLiked = false;
      this.isLikedByUser = false;
      this.numberOfLikes--;
    });
  }

  editToggle() {
    //console.log();
    this.isEdit = true;
    this.getQuestionById(this.id);
  }
}
