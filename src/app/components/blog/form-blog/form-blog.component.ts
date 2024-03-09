import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject, of } from 'rxjs';
import { switchMap, mergeMap, takeUntil } from 'rxjs/operators';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Attachment } from '../../../shared/interface/attachment.interface';
import { Category, CategoryModel } from '../../../shared/interface/category.interface';
import { GetTags } from '../../../shared/action/tag.action';
import { GetCategories } from '../../../shared/action/category.action';
import { CreateBlog, EditBlog, UpdateBlog } from '../../../shared/action/blog.action';
import { Blog } from '../../../shared/interface/blog.interface';
import { Tag, TagModel } from '../../../shared/interface/tag.interface';
import { BlogState } from '../../../shared/state/blog.state';
import { CategoryState } from '../../../shared/state/category.state';
import { TagState } from '../../../shared/state/tag.state';
import * as data from '../../../shared/data/ck-editor-config';
import { EditorModule } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-form-blog',
  templateUrl: './form-blog.component.html',
  styleUrls: ['./form-blog.component.scss']
})
export class FormBlogComponent {

  @Input() type: string;

  @Select(BlogState.selectedBlog) blog$: Observable<Blog>;
  @Select(CategoryState.category) category$: Observable<CategoryModel>;
  @Select(TagState.tag) tag$: Observable<TagModel>;

  public form: FormGroup;
  public id: number;
  public selectedCategories: number[] = [];
  public selectedTags: number[] = [];
  
  public editor = EditorModule;// 
  public config = data.config;
  
  private destroy$ = new Subject<void>();

  constructor(private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.store.dispatch(new GetCategories({type: 'post'}));
    this.store.dispatch(new GetTags({type: 'post'}));
    this.form = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl(),
      content: new FormControl(),
      meta_title: new FormControl(),
      meta_description: new FormControl(),
      blog_meta_image_id: new FormControl(),
      //blog_thumbnail_id: new FormControl('', [Validators.required]),
      blog_thumbnail_id: new FormControl(''),
      categories: new FormControl('', [Validators.required]),
      tags: new FormControl(),
      is_featured: new FormControl(0),
      is_sticky: new FormControl(0),
      status: new FormControl(1),
    });
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            this.id = params['id'];
            return this.store
                      .dispatch(new EditBlog(params['id']))
                      .pipe(mergeMap(() => this.store.select(BlogState.selectedBlog)))
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(blog => {
        this.id = blog?.id!;
        this.selectedCategories = blog?.categories.map(value => value?.id!)!;
        this.selectedTags = blog?.tags.map(value => value?.id!)!;
        this.form.patchValue({
          title: blog?.title,
          description: blog?.description,
          content: blog?.content,
          blog_thumbnail_id: blog?.blog_thumbnail_id,
          categories: this.selectedCategories,
          tags: this.selectedTags,
          meta_title: blog?.meta_title,
          meta_description: blog?.meta_description,
          is_featured: blog?.is_featured,
          is_sticky: blog?.is_sticky,
          status: blog?.status
        });
      });
      
  }

  selectThumbnail(data: Attachment) {
    if(!Array.isArray(data)) {
      this.form.controls['blog_thumbnail_id'].setValue(data ? data.id : '');
    }
  }

  selectMetaImage(data: Attachment) {
    if(!Array.isArray(data)) {
      this.form.controls['blog_meta_image_id'].setValue(data ? data.id : null);
    }
  }

  selectCategoryItem(data: number[]) {
    if(Array.isArray(data)) {
      this.form.controls['categories'].setValue(data);
    }
  }

  selectTagItem(data: number[]) {
    if(Array.isArray(data)) {
      this.form.controls['tags'].setValue(data);
    }
  }

  submit() {
    this.form.markAllAsTouched();
    let blog = this.form.value as Blog;
    let category = {} as Category;
    let categories = [] as Category[];
    let formsCategories = this.form.get("categories");
    let categoriesIds = formsCategories.value as [];
    
    category.id = Number(categoriesIds.at(0));
    categories.push(category);
    blog.categories = categories;

    
    let formsTags = this.form.get("tags");
    let tagsIds = formsTags.value as [];

    let tags = [] as Tag[];
    for(let t of tagsIds) {
      let tag = {} as Tag;
      tag.id =  Number(t);
      tags.push(tag);
    }
    blog.tags = tags;

    let action = new CreateBlog(blog);
    
    if(this.type == 'edit' && this.id) {
      action = new UpdateBlog(this.form.value, this.id)
    }
    
    if(this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => { this.router.navigateByUrl('/blog'); }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  edit() {
    this.router.navigateByUrl(`blog/answers/edit/1`);
  }

}
