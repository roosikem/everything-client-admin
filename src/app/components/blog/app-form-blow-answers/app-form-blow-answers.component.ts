import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Select2Data } from 'ng-select2-component';
import { Observable } from 'rxjs';
import { CreateAnswer, GetAnswers } from 'src/app/shared/action/blog.answer.action';
import { GetLookup } from 'src/app/shared/action/lookup.action';
import { Answer, AnswerModel, Blog } from 'src/app/shared/interface/blog.interface';
import { AnswerState } from 'src/app/shared/state/blog-answer.state';
import { LookUpState } from 'src/app/shared/state/lookup.state';
import { Editor } from 'tinymce';
@Component({
  selector: 'app-app-form-blow-answers',
  templateUrl: './app-form-blow-answers.component.html',
  styleUrl: './app-form-blow-answers.component.scss'
})
export class AppFormBlowAnswersComponent {

  @Select(AnswerState.answers) answers$: Observable<AnswerModel>;
  @Select(LookUpState.showTypeSelect) showType$: Observable<Select2Data>;

  @Select(LookUpState.languageSelect) language$: Observable<Select2Data>;

  @Input() type: string;
  public active = 'content';
  
  p1 = new FormControl('');
  p2 = new FormControl('');
  p3 = new FormControl('');

  public editor1: Editor;
  id: number;
  selectedCategories: number[];
  selectedTags: number[];
  showTypeSelect = new FormControl('');
  languageSelect = new FormControl('');

  constructor(private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) {
      
      this.route.params.subscribe(params => {
        console.log(params['id']);
        this.id = params['id'];
        const answer$ = new GetAnswers(params['id']);
        this.store.dispatch(answer$);
      });
  
     

  }

  

  ngOnInit() {

    this.showType$.subscribe(res1 => {
      let res = res1 as any;
      if (res.length == 0) {
        this.store.dispatch(new GetLookup()).subscribe({
          complete: () => {
                  
          }
        });
      } else {
      }

    })

    this.language$.subscribe(res1 => {
      let res = res1 as any;
      if (res.length == 0) {
        this.store.dispatch(new GetLookup()).subscribe({
          complete: () => {
            
          }
        });
      } else {
      }
    })

    this.answers$.subscribe(ans => {
      console.log(ans);
    })
      
  }
 
  public  clickForm() {
    let answer = {} as Answer;
    answer.answerP1 = this.p1.value;
    answer.answerP2 = this.p2.value;
    answer.answerP3 = this.p3.value;

    if (this.showTypeSelect.value != "-1")
      answer.showType = Number(this.showTypeSelect.value);
    if (this.languageSelect.value != "-1")
      answer.codeLanguage = Number(this.languageSelect.value);
    if (!answer.blog)
    answer.blog = {} as Blog;
    answer.blog.id = Number(this.id);
    const updateAnswer = new CreateAnswer(answer);
    this.store.dispatch(updateAnswer).subscribe({
      complete: () => {
        //this.toastService.showSuccessToast('Create Answer', 'Request Success!');
        const answers = new GetAnswers(this.id);
        this.store.dispatch(answers);

      },
    });
  }

}
