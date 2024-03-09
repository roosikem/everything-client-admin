import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogAnswersComponent } from './blog-answers.component';

describe('BlogAnswersComponent', () => {
  let component: BlogAnswersComponent;
  let fixture: ComponentFixture<BlogAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogAnswersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlogAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
