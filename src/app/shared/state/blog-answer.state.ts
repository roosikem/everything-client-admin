import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { Answer, AnswerModel, Blog } from "../interface/blog.interface";
import { BlogService } from "../services/blog.service";
import { NotificationService } from "../services/notification.service";
import { CreateAnswer, DeleteAnswer, GetAnswers } from "../action/blog.answer.action";

export class AnswerStateModel {
  answers = {
    data: [] as Answer[],
    total: 0
  }
  selectedAnswer: Answer | null;
}

export class SavedAnswerState {
  savedAnswer: Answer | null;
}

@State<AnswerStateModel>({
  name: "answers",
  defaults: {
    answers: {
      data: [],
      total: 0
    },
    selectedAnswer: null
  },
})
@State<SavedAnswerState>({
  name: "savedAns",
  defaults: {
    savedAnswer: null
  },
})
@Injectable()
export class AnswerState {
  
  constructor(private store: Store,
    private notificationService: NotificationService,
    private blogService: BlogService) {}

  @Selector()
  static answer(state: AnswerStateModel) {
    return state.answers;
  }
  
  @Selector()
  static answers(state: AnswerStateModel) {
    return state.answers;
  }

  @Selector()
  static selectedAnswer(state: AnswerStateModel) {
    return state.selectedAnswer;
  }

  @Selector()
  static savedAnswer(state: SavedAnswerState) {
    return state.savedAnswer;
  }

  @Action(GetAnswers)
  getAnswers(ctx: StateContext<AnswerStateModel>, action: GetAnswers) {
    return this.blogService.getAnswers(action.id).pipe(
      tap({
        next: result => { 
          ctx.patchState({
            answers: {
              data: result.data,
              total: result?.total ? result?.total : result.data?.length
            }
          });
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(CreateAnswer)
  create(ctx: StateContext<SavedAnswerState>, action: CreateAnswer) {
    return this.blogService.createAnswers(action.payload).pipe(
      tap({
        next: result => { 
          console.log(result);
          ctx.patchState({
            savedAnswer: result
          });
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(DeleteAnswer)
  delete(ctx: StateContext<AnswerStateModel>, action: DeleteAnswer) {
    return this.blogService.deleteAnswer(action.id).pipe(
      tap({
        next: result => { 
          ctx.patchState({
            answers: {
              data: result.data,
              total: result?.total ? result?.total : result.data?.length
            }
          });
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }


}
