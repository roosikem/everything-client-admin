import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetBlogs, CreateBlog, EditBlog, 
         UpdateBlog, UpdateBlogStatus, DeleteBlog, 
         DeleteAllBlog } from "../action/blog.action";
import { Blog } from "../interface/blog.interface";
import { BlogService } from "../services/blog.service";
import { NotificationService } from "../services/notification.service";

export class BlogStateModel {
  blog = {
    data: [] as Blog[],
    total: 0
  }
  selectedBlog: Blog | null;
}

@State<BlogStateModel>({
  name: "blog",
  defaults: {
    blog: {
      data: [],
      total: 0
    },
    selectedBlog: null
  },
})
@Injectable()
export class BlogState {
  
  constructor(private store: Store,
    private notificationService: NotificationService,
    private blogService: BlogService) {}

  @Selector()
  static blog(state: BlogStateModel) {
    return state.blog;
  }
  
  @Selector()
  static blogs(state: BlogStateModel) {
    return state.blog.data.map(res => { 
      return { label: res?.title, value: res?.id }
    });
  }

  @Selector()
  static selectedBlog(state: BlogStateModel) {
    return state.selectedBlog;
  }

  @Action(GetBlogs)
  getBlogs(ctx: StateContext<BlogStateModel>, action: GetBlogs) {
    return this.blogService.getBlogs(action.payload).pipe(
      tap({
        next: result => { 
          ctx.patchState({
            blog: {
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

  @Action(CreateBlog)
  create(ctx: StateContext<BlogStateModel>, action: CreateBlog) {
    return this.blogService.createBlog(action.payload).pipe(
      tap({
        next: result => { 
          return this.blogService.getBlogs().pipe(
            tap({
              next: result => { 
                ctx.patchState({
                  blog: {
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
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(EditBlog)
  edit(ctx: StateContext<BlogStateModel>, { id }: EditBlog) {
    const state = ctx.getState();
    const result = state.blog.data.find(blog => blog.id == id);
    ctx.patchState({
      ...state,
      selectedBlog: result
    });
  }

  @Action(UpdateBlog)
  update(ctx: StateContext<BlogStateModel>, { payload, id }: UpdateBlog) {
    payload.id = id;
    return this.blogService.createBlog(payload).pipe(
      tap({
        next: result => { 
          return this.blogService.getBlogs(payload).pipe(
            tap({
              next: result => { 
                ctx.patchState({
                  blog: {
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
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateBlogStatus)
  updateStatus(ctx: StateContext<BlogStateModel>, { id, status }: UpdateBlogStatus) {
    const state = ctx.getState();
    return this.blogService.updateBlogStatus(id, status).pipe(
      tap({
        next: result => { 
          return this.blogService.getBlogs().pipe(
            tap({
              next: result => { 
                ctx.patchState({
                  blog: {
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
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(DeleteBlog)
  delete(ctx: StateContext<BlogStateModel>, { id }: DeleteBlog) {
    return this.blogService.deleteBlog(id).pipe(
      tap({
        next: result => { 
          return this.blogService.getBlogs().pipe(
            tap({
              next: result => { 
                ctx.patchState({
                  blog: {
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
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(DeleteAllBlog)
  deleteAll(ctx: StateContext<BlogStateModel>, { ids }: DeleteAllBlog) {
    // Blog Multiple Delete Logic Here
  }

}
