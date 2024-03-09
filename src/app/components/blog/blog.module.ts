import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { BlogRoutingModule } from './blog-routing.module';
import { SharedModule } from "../../shared/shared.module";
import { CategoryModule } from "../category/category.module";
import { TagModule } from "../tag/tag.module";

// Components
import { BlogComponent } from './blog.component';
import { EditBlogComponent } from './edit-blog/edit-blog.component';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import { FormBlogComponent } from './form-blog/form-blog.component';
import { EditBlogCategoryComponent } from './category/edit-blog-category/edit-blog-category.component';
import { CreateBlogTagComponent } from './tag/create-blog-tag/create-blog-tag.component';
import { EditBlogTagComponent } from './tag/edit-blog-tag/edit-blog-tag.component';
import { BlogCategoryComponent } from './category/blog-category/blog-category.component';
import { BlogTagComponent } from './tag/blog-tag/blog-tag.component';
import { EditorModule } from '@tinymce/tinymce-angular';
// States
import { BlogState } from '../../shared/state/blog.state';
import { BlogAnswersComponent } from './blog-answers/blog-answers.component';
import { AppFormBlowAnswersComponent } from './app-form-blow-answers/app-form-blow-answers.component';
import { AnswerState } from 'src/app/shared/state/blog-answer.state';
import { AnswerComponent } from './answer/answer.component';
import { LookUpState } from 'src/app/shared/state/lookup.state';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    BlogComponent,
    EditBlogComponent,
    CreateBlogComponent,
    FormBlogComponent,
    EditBlogCategoryComponent,
    CreateBlogTagComponent,
    EditBlogTagComponent,
    BlogCategoryComponent,
    BlogTagComponent,
    BlogAnswersComponent,
    AppFormBlowAnswersComponent,
    AnswerComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    SharedModule,
    CategoryModule,
    TagModule,
    NgxsModule.forFeature([BlogState, AnswerState, LookUpState]),
    EditorModule,
    ToastrModule.forRoot(),
    NgbModule
  ],
  providers: [
     provideToastr(), // Toastr providers
  ]
})
export class BlogModule { }
