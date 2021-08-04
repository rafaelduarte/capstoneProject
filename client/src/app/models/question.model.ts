export interface answers {
  _id: string;
  text: string;
  author: string;
  issued_On: number;
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
}
