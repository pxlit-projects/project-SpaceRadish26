import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewListComponent } from './review-list.component';
import { PostService } from '@services/post-service.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ReviewListComponent', () => {
  let component: ReviewListComponent;
  let fixture: ComponentFixture<ReviewListComponent>;
  let postServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    postServiceMock = {
      getPostsToReview: jasmine.createSpy('getPostsToReview').and.returnValue(of([
        { id: '1', title: 'Post 1', content: 'Content 1' },
        { id: '2', title: 'Post 2', content: 'Content 2' }
      ]))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [ReviewListComponent],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize posts on ngOnInit', () => {
    expect(postServiceMock.getPostsToReview).toHaveBeenCalled();
    expect(component.postsToReview.length).toBe(2);
    expect(component.postsToReview[0].title).toBe('Post 1');
  });

  it('should render posts', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const postElements = compiled.querySelectorAll('.bg-white');
    expect(postElements.length).toBe(2);
    expect(postElements[0].querySelector('h2')?.textContent).toContain('Post 1');
    expect(postElements[1].querySelector('h2')?.textContent).toContain('Post 2');
  });

  it('should navigate to review post on button click', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[0].triggerEventHandler('click', null);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/posts/review/1']);
  });
});
