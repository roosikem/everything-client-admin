import { Answer } from "../interface/blog.interface";

export class GetAnswers {
    static readonly type = "[Blog] AnswerEdit";
    constructor(public id: number) {}
  }

  export class CreateAnswer {
    static readonly type = "[Answer] Create";
    constructor(public payload: Answer) {}
  }

  export class DeleteAnswer {
    static readonly type = "[Answer] Delete";
    constructor(public id: number) {}
  }