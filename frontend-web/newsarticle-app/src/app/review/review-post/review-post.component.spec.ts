import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewPostComponent } from './review-post.component';
import { PostService } from '@services/post-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('ReviewPostComponent', () => {
  let component: ReviewPostComponent;
  let fixture: ComponentFixture<ReviewPostComponent>;
  let postServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    postServiceMock = {
      getPostToReviewById: jasmine.createSpy('getPostToReviewById').and.returnValue(of({
        id: '1',
        author: 'authorName',
        title: 'postTitle',
        content: 'postContent',
        creationDate: '2023-10-01',
        concept: false,
        approved: false,
        rejectedReason: ''
      })),
      updatePostReviewStatus: jasmine.createSpy('updatePostReviewStatus').and.returnValue(of({}))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    activatedRouteMock = {
      snapshot: {
        params: {
          id: '1'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReviewPostComponent],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize post on ngOnInit', () => {
    expect(postServiceMock.getPostToReviewById).toHaveBeenCalledWith('1');
    expect(component.post).toEqual({
      id: '1',
      author: 'authorName',
      title: 'postTitle',
      content: 'postContent',
      creationDate: '2023-10-01',
      concept: false,
      approved: false,
      rejectedReason: ''
    });
  });

  it('should render post details', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('postTitle');
    expect(compiled.querySelector('p')?.textContent).toContain('Author: authorName');
  });

  it('should call updatePostReviewStatus on form submit with approval', () => {
    component.approved = true;
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button'));
    submitButton.triggerEventHandler('click', null);

    expect(postServiceMock.updatePostReviewStatus).toHaveBeenCalledWith('1', true, '');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/posts/review']);
  });

  it('should call updatePostReviewStatus on form submit with rejection', () => {
    component.approved = false;
    component.rejectedReason = 'Not good enough';
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button'));
    submitButton.triggerEventHandler('click', null);

    expect(postServiceMock.updatePostReviewStatus).toHaveBeenCalledWith('1', false, 'Not good enough');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/posts/review']);
  });

  it('should not call updatePostReviewStatus if approved is null', () => {
    component.approved = null;
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button'));
    submitButton.triggerEventHandler('click', null);

    expect(postServiceMock.updatePostReviewStatus).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should show rejection reason textarea when rejected', () => {
    component.approved = false;
    fixture.detectChanges();

    const rejectionTextarea = fixture.debugElement.query(By.css('textarea'));
    expect(rejectionTextarea).toBeTruthy();
  });

  it('should hide rejection reason textarea when approved', () => {
    component.approved = true;
    fixture.detectChanges();

    const rejectionTextarea = fixture.debugElement.query(By.css('textarea'));
    expect(rejectionTextarea).toBeFalsy();
  });
});
