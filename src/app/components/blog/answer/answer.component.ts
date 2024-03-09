import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Select2Data } from 'ng-select2-component';
import { Observable } from 'rxjs';
import { Answer, Blog } from 'src/app/shared/interface/blog.interface';
import * as ace from "ace-builds";
import { CreateAnswer, DeleteAnswer } from 'src/app/shared/action/blog.answer.action';
import { AnswerState } from 'src/app/shared/state/blog-answer.state';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT } from '@angular/common';
import { DeleteModalComponent } from 'src/app/shared/components/ui/modal/delete-modal/delete-modal.component';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.scss'
})
export class AnswerComponent {

  @ViewChild("editor") private editor: ElementRef<HTMLElement>;

  @Select(AnswerState.savedAnswer) savedAns$: Observable<Answer>;

  checkboxControl = new FormControl();

  @ViewChild("deleteModal") DeleteModal: DeleteModalComponent;

  @Input()
  blogId: number;

  @Input()
  answer: Answer;

  @Input()
  showType$: Observable<Select2Data>;

  @Input()
  language$: Observable<Select2Data>;

  public active = 'content';

  p1 = new FormControl('');
  p2 = new FormControl('');
  p3 = new FormControl('');

  showTypeSelect = new FormControl('');
  languageSelect = new FormControl('');

  edited = false;
  public array = [{}];

  content$: Promise<String>;
  button_text_switch = "Edit";


  constructor(@Inject(DOCUMENT) private document: Document, private store: Store, private toastr: ToastrService) {
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.32.3/src-noconflict/');
    this.savedAns$.subscribe(res => {
      if (res) {
        this.populateAnsView();
        this.loadAceEditor();
      }
    });

  }

  ngOnInit() {


    this.populateAnsView();

    if (this.answer.answerP1)
      this.p1.setValue(this.answer.answerP1);
    if (this.answer.answerP2)
      this.p2.setValue(this.answer.answerP2);
    if (this.answer.answerP3)
      this.p3.setValue(this.answer.answerP3);

    this.language$.subscribe({
      complete: () => {
        this.languageSelect.setValue(this.answer.codeLanguage.toString());

      }
    })

    this.languageSelect.setValue(this.answer.codeLanguage.toString());
    this.showTypeSelect.setValue(this.answer.showType.toString());

    this.showType$.subscribe({
      complete: () => {
        this.showTypeSelect.setValue(this.answer.showType.toString());
      }
    })

  }

  private populateAnsView() {
    var html = "";
    let arr = [];
    var answer = this.answer;
    html += answer.answerP1;

    if (answer.showType == 1) {
      if (answer.answerP2) {
        html += answer.answerP2;
      }
    } else if (answer.showType == 2) {

      if (answer.answerP3) {
        html += '<p>';
        var space = "";
        var showLine = true;
        if (!answer.showAceLineNumber || answer.showAceLineNumber == 0) {
          space = space + '<div >';
          showLine = false;
        }
        var id = 'editor' + answer.answerId;
        var langauge = answer.codeLanguage;

        html += space + '<div #editor class="' + id + '">' + answer.answerP3.trim() + '</div>';
        if (!answer.showAceLineNumber || answer.showAceLineNumber == 0) {
          html += '</div>';
        }
        html += '</p>';
        var obj = { id: id, codeLanguage: langauge, showLineNumber: showLine };
        arr.push(obj);
      }
    }
    this.content$ = new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(html);
      }, 0);
    });
    this.array = arr;
  }

  ngAfterViewInit(): void {
    this.loadAceEditor();
  }

  private loadAceEditor() {
    setTimeout(() => {
      for (var idx in this.array) {
        let arr: any = this.array[idx];
        try {

          const slides = this.document.getElementsByClassName(arr.id);
          for (let i = 0; i < slides.length; i++) {
            const slide = slides[i] as Element;
            const editor = ace.edit(slide);
            var lang = 'java';
            // editor.session.setValue("<h1>Ace Editor works great in Angular!</h1>");
            editor.setTheme("ace/theme/xcode");
            editor.session.setMode("ace/mode/" + lang.toLowerCase());
            //editor.setOptions({ maxLines: 30 });
            //editor.renderer.hideCursor();
            editor.setAutoScrollEditorIntoView(true);
            editor.setShowPrintMargin(false);
            editor.setReadOnly(true);
            editor.renderer.setShowGutter(false);
            editor.renderer.setHighlightGutterLine(false);
            const renderer = editor.renderer;
            renderer.setCursorStyle('hidden');
            editor.setOptions({ maxLines: 30, readOnly: true, highlightActiveLine: false, highlightGutterLine: false });
            editor.resize();
          }
        } catch (e) {
          console.log(e);
        }
      }
    }, 0);
  }

  viewChange(event: Event) {
    // Get the new input value
    const chinput = (event.target as HTMLInputElement);
    if (chinput.checked) {
      this.updateView(chinput.checked, "View");
    } else {
      this.updateView(chinput.checked, "Edit");
    }
  }

  private updateView(checked: boolean, text: string) {
    this.edited = checked;
    this.button_text_switch = text;
    if (!checked)
      this.loadAceEditor();
  }

  deleteAnswer() {
    const deleteAnswer$ = new DeleteAnswer(this.answer.answerId);
    this.store.dispatch(deleteAnswer$);
  }

  updateForm() {
    this.answer.answerP1 = this.p1.value;
    this.answer.answerP2 = this.p2.value;
    this.answer.answerP3 = this.p3.value;

    if (this.showTypeSelect.value != "-1")
      this.answer.showType = Number(this.showTypeSelect.value);
    if (this.languageSelect.value != "-1")
      this.answer.codeLanguage = Number(this.languageSelect.value);
    if (!this.answer.blog)
      this.answer.blog = {} as Blog;
    this.answer.blog.id = Number(this.blogId);
    const updateAnswer = new CreateAnswer(this.answer);
    this.store.dispatch(updateAnswer).subscribe({
      complete: () => {
        let checked = this.checkboxControl.value as boolean;
        let viewText = "";
        if (checked) {
          viewText = "Edit";
        } else {
          viewText = "View";
        }

        checked = !checked;
        this.checkboxControl.setValue(checked);
        this.updateView(checked, viewText);

      },
    });

  }

  deleteAction(event) {
    const deleteAnswer$ = new DeleteAnswer(this.answer.answerId);
    this.store.dispatch(deleteAnswer$);
    this.DeleteModal.closeModel();
  }

}
