import { Component, EventEmitter, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Params } from "../../shared/interface/core.interface";
import { TableConfig, TableClickedAction } from "../../shared/interface/table.interface";
import { Blog, BlogModel } from "../../shared/interface/blog.interface";
import { BlogState } from '../../shared/state/blog.state';
import { GetBlogs, UpdateBlogStatus, DeleteBlog, DeleteAllBlog } from '../../shared/action/blog.action';
import { GetLookup } from '../../shared/action/lookup.action';
import { ConfirmationModalComponent } from 'src/app/shared/components/ui/modal/confirmation-modal/confirmation-modal.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {

  @Select(BlogState.blog) blog$: Observable<BlogModel>;
  @ViewChild("confirmationModal") ConfirmationModalComponent: ConfirmationModalComponent;

  confirmModel$: EventEmitter<boolean> = new EventEmitter<boolean>;

  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "title", dataField: "title", sortable: true, sort_direction: 'desc' },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' },
      { title: "status", dataField: "status", type: "switch" },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "blog.edit" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "blog.destroy" },
    ],
    data: [] as Blog[],
    total: 0
  };

  constructor(private store: Store,
    public router: Router, private authService: AuthService) {
      const lookup = new GetLookup();
      this.store.dispatch(lookup);
     }

  ngOnInit() {
    this.blog$.subscribe(blog => { 
      this.tableConfig.data  = blog ? blog?.data  : [];
      this.tableConfig.total = blog ? blog?.total : 0;
    });

    this.confirmModel$.subscribe(res => {
      if(res) {
        //this.toastService.showSuccessToast('Update Status', 'Request Success!');
      }
    })

   
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetBlogs(data)).subscribe();
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.edit(action.data)
    else if(action.actionToPerform == 'status')
      this.status(action.data)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
    else if(action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
  }

  edit(data: Blog) {
    this.router.navigateByUrl(`/blog/edit/${data.id}`);
  }

  status(data: Blog) {
    this.store.dispatch(new UpdateBlogStatus(data.id, data.status)).subscribe({
      complete: () => {
        this.confirmModel$.next(true);
      }
      
    });
  }

  delete(data: Blog) {
    this.store.dispatch(new DeleteBlog(data.id))
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllBlog(ids))
  }

}
