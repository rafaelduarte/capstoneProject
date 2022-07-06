import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth/authentication.service';
import { User } from '../models/user.model';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../services/data.service';
import { questions } from '../models/question.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  constructor(
    public authService: AuthenticationService,
    public dataService: DataService,
    private router: Router
  ) {}
  faSearch = faSearch;
  searchText = '';
  characters: Array<String> = [];
  questions!: questions[];
  ngOnInit(): void {
    this.dataService.getQuestions().subscribe((data) => {
      //console.log(data);
      this.questions = data;
      let title: string;
      for (let i = 0; i < this.questions.length; i++) {
        //console.log(this.questions[i].title);
        title = this.questions[i].title;
        this.characters.push(title);
      }
      //console.log(this.searchText);
    });
  }

  searchClick(questionTitle: String) {
    //console.log(questionTitle);
    this.searchText = '';
    let questionID: string = '';
    for (let i = 0; i < this.questions.length; i++) {
      if (this.questions[i].title === questionTitle) {
        questionID = this.questions[i]._id;
      }
    }
    //console.log(questionID);
    this.router.navigateByUrl(`/questions/${questionID}`);
  }
}
