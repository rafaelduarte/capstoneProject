export interface answers {
  _id: string;
  text: string;
  author: author;
  issued_On: number;
}

export interface author {
  _id: string;
}

export interface owner {
  _id: string;
  name: string;
  email: string;
}

export interface questions {
  _id: string;
  title: string;
  text: string;
  owner: owner;
  issued_On: number;
  answers: answers;
  totalAnswers: number;
  likes: number;
  likedBy: string;
  dislikes: number;
  dislikedBy: string;
  isEdited: Boolean;
}
