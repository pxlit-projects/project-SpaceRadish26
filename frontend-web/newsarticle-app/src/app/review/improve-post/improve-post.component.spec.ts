import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImprovePostComponent } from './improve-post.component';
import { PostService } from '@services/post-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('ImprovePostComponent', () => {
  let component: ImprovePostComponent;
  let fixture: ComponentFixture<ImprovePostComponent>;
  let postServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    postServiceMock = {
      getPostById: jasmine.createSpy('getPostById').and.returnValue(of({
        id: '1',
        author: 'authorName',
        title: 'postTitle',
        content: 'postContent',
        creationDate: '2023-10-01',
        concept: false,
        approved: false,
        rejectedReason: 'Needs improvement'
      })),
      updatePost: jasmine.createSpy('updatePost').and.returnValue(of({}))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ImprovePostComponent],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ImprovePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize post on ngOnInit', () => {
    expect(postServiceMock.getPostById).toHaveBeenCalledWith('1');
    expect(component.post).toEqual({
      id: '1',
      author: 'authorName',
      title: 'postTitle',
      content: 'postContent',
      creationDate: '2023-10-01',
      concept: false,
      approved: false,
      rejectedReason: 'Needs improvement'
    });
  });

  it('should render post details', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect((compiled.querySelector('#title') as HTMLInputElement).value).toBe('postTitle');
    expect((compiled.querySelector('#content') as HTMLTextAreaElement).value).toBe('postContent');
    expect((compiled.querySelector('#author') as HTMLInputElement).value).toBe('authorName');
    expect((compiled.querySelector('#rejectedReason') as HTMLTextAreaElement).value).toBe('Needs improvement');
  });

  it('should call updatePost on form submit', () => {
    component.post.title = 'Updated Title';
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    expect(postServiceMock.updatePost).toHaveBeenCalledWith(component.post);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });



  it('should enable title and content inputs if post is rejected', () => {
    component.post.rejectedReason = 'Needs improvement';
    fixture.detectChanges();

    const titleInput = fixture.debugElement.query(By.css('#title')).nativeElement;
    const contentInput = fixture.debugElement.query(By.css('#content')).nativeElement;

    expect(titleInput.disabled).toBeFalse();
    expect(contentInput.disabled).toBeFalse();
  });

  it('should show rejection reason textarea when rejected', () => {
    component.post.rejectedReason = 'Needs improvement';
    fixture.detectChanges();

    const rejectionTextarea = fixture.debugElement.query(By.css('#rejectedReason'));
    expect(rejectionTextarea).toBeTruthy();
  });

  it('should hide rejection reason textarea when approved', () => {
    component.post.rejectedReason = '';
    fixture.detectChanges();

    const rejectionTextarea = fixture.debugElement.query(By.css('#rejectedReason'));
    expect(rejectionTextarea).toBeFalsy();
  });
});
