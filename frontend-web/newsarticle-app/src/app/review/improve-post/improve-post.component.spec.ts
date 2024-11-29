import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovePostComponent } from './improve-post.component';

describe('ImprovePostComponent', () => {
  let component: ImprovePostComponent;
  let fixture: ComponentFixture<ImprovePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImprovePostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImprovePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
