import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsListComponent } from './posts-list.component';
import { PostService } from '@services/post-service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PostsListComponent', () => {
  let component: PostsListComponent;
  let fixture: ComponentFixture<PostsListComponent>;
  let postServiceMock: any;
  let routerMock: any;
  let dialogMock: any;

  beforeEach(async () => {
    postServiceMock = {
      getFinishedPosts: jasmine.createSpy('getFinishedPosts').and.returnValue(of([
        { id: '1', author: 'Author 1', title: 'Post 1', content: 'Content 1', creationDate: '2023-01-01', concept: false, approved: true, rejectedReason: '' },
        { id: '2', author: 'Author 2', title: 'Post 2', content: 'Content 2', creationDate: '2023-01-02', concept: false, approved: true, rejectedReason: '' }
      ])),
      getConceptPostsForUser: jasmine.createSpy('getConceptPostsForUser').and.returnValue(of([
        { id: '3', author: 'Author 3', title: 'Concept 1', content: 'Content 3', creationDate: '2023-01-03', concept: true, approved: false, rejectedReason: '' }
      ])),
      getApprovedAndRejectMessagedPosts: jasmine.createSpy('getApprovedAndRejectMessagedPosts').and.returnValue(of([
        { id: '4', author: 'Author 4', title: 'Approved 1', content: 'Content 4', creationDate: '2023-01-04', concept: false, approved: true, rejectedReason: '' }
      ]))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    dialogMock = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of({ filterAuthor: 'Author 1', filterContent: 'Content 1', filterDate: '2023-01-01' })
      })
    };

    await TestBed.configureTestingModule({
      imports: [PostsListComponent, BrowserAnimationsModule],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatDialog, useValue: dialogMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with posts', () => {
    expect(postServiceMock.getFinishedPosts).toHaveBeenCalled();
    expect(postServiceMock.getConceptPostsForUser).toHaveBeenCalled();
    expect(postServiceMock.getApprovedAndRejectMessagedPosts).toHaveBeenCalled();
    expect(component.posts.length).toBe(2);
    expect(component.postConcepts.length).toBe(1);
    expect(component.approRejePosts.length).toBe(1);
  });

  it('should navigate to update post', () => {
    component.navigateToUpdatePost('1');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/update-post', '1']);
  });

  it('should navigate to improve post', () => {
    component.navigateToImprovePost('4');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/posts/improve', '4']);
  });

  it('should refresh items', () => {
    component.refreshItems();
    expect(postServiceMock.getFinishedPosts).toHaveBeenCalled();
    expect(postServiceMock.getConceptPostsForUser).toHaveBeenCalled();
    expect(postServiceMock.getApprovedAndRejectMessagedPosts).toHaveBeenCalled();
  });

  it('should apply filter correctly', () => {
    component.posts = [
      { id: '1', author: 'Author 1', title: 'Post 1', content: 'Content 1', creationDate: '2023-01-01', concept: false, approved: true, rejectedReason: '' },
      { id: '2', author: 'Author 2', title: 'Post 2', content: 'Content 2', creationDate: '2023-01-02', concept: false, approved: true, rejectedReason: '' }
    ];
    component.applyFilter('Author 1', 'Content 1', '2023-01-01');
    expect(component.filteredPosts.length).toBe(1);
    expect(component.filteredPosts[0].id).toBe('1');
  });
});
