import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedPostDetailComponent } from './published-post-detail.component';

describe('PublishedPostDetailComponent', () => {
  let component: PublishedPostDetailComponent;
  let fixture: ComponentFixture<PublishedPostDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishedPostDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishedPostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
