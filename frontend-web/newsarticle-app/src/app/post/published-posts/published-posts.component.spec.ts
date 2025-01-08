import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublishedPostsComponent } from './published-posts.component';
import { PostService } from '@services/post-service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { FilterModalComponent } from '@components/usability/filter-modal/filter-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PublishedPostsComponent', () => {
  let component: PublishedPostsComponent;
  let fixture: ComponentFixture<PublishedPostsComponent>;
  let postServiceMock: any;
  let routerMock: any;
  let dialogMock: any;

  beforeEach(async () => {
    postServiceMock = {
      getApprovedPosts: jasmine.createSpy('getApprovedPosts').and.returnValue(of([
        { id: 1, title: 'Post 1', content: 'Content 1', author: 'Author 1', creationDate: '2023-01-01' },
        { id: 2, title: 'Post 2', content: 'Content 2', author: 'Author 2', creationDate: '2023-01-02' }
      ]))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    dialogMock = {
      open: jasmine.createSpy('open').and.returnValue({
        componentInstance: {
          filterApplied: {
            subscribe: jasmine.createSpy('subscribe').and.callFake((fn: any) => fn({
              filterAuthor: 'Author 1',
              filterContent: '',
              filterDate: ''
            }))
          }
        }
      })
    };

    await TestBed.configureTestingModule({
      imports: [PublishedPostsComponent],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatDialog, useValue: dialogMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PublishedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with approved posts', () => {
    expect(postServiceMock.getApprovedPosts).toHaveBeenCalled();
    expect(component.posts.length).toBe(2);
    expect(component.filteredPosts.length).toBe(2);
  });

  it('should filter posts based on filter criteria', () => {
    component.openFilterModal();
    expect(dialogMock.open).toHaveBeenCalledWith(FilterModalComponent);
    expect(component.filteredPosts.length).toBe(1);
    expect(component.filteredPosts[0].author).toBe('Author 1');
  });

  it('should navigate to update post', () => {
    component.navigateToUpdatePost(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/update-post', 1]);
  });

  it('should view details of a post', () => {
    component.viewDetailsOf('1');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/published-posts/1']);
  });
});
