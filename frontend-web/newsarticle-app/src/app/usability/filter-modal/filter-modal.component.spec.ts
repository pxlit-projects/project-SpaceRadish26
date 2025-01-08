import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterModalComponent } from './filter-modal.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('FilterModalComponent', () => {
  let component: FilterModalComponent;
  let fixture: ComponentFixture<FilterModalComponent>;
  let dialogRefMock: any;

  beforeEach(async () => {
    dialogRefMock = {
      close: jasmine.createSpy('close')
    };

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
        FilterModalComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply filter and close dialog', () => {
    component.filterAuthor = 'author';
    component.filterContent = 'content';
    component.filterDate = '2023-10-01';

    spyOn(component.filterApplied, 'emit');

    component.applyFilter();

    expect(component.filterApplied.emit).toHaveBeenCalledWith({
      filterAuthor: 'author',
      filterContent: 'content',
      filterDate: '2023-10-01'
    });
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should close dialog without applying filter', () => {
    component.close();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should render form fields and buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Filter Criteria');
    expect(compiled.querySelector('mat-form-field')).toBeTruthy();
    expect(compiled.querySelectorAll('mat-form-field').length).toBe(3);
    expect(compiled.querySelector('button')?.textContent).toContain('Apply');
    expect(compiled.querySelectorAll('button').length).toBe(2);
  });

  it('should bind input fields to component properties', () => {
    const authorInput = fixture.debugElement.query(By.css('input[matInput][type="text"]')).nativeElement;
    const contentInput = fixture.debugElement.query(By.css('input[matInput][type="text"]')).nativeElement;
    const dateInput = fixture.debugElement.query(By.css('input[matInput][type="date"]')).nativeElement;

    authorInput.value = '';
    authorInput.dispatchEvent(new Event('input'));
    contentInput.value = 'newContent';
    contentInput.dispatchEvent(new Event('input'));
    dateInput.value = '2023-10-02';
    dateInput.dispatchEvent(new Event('input'));

    expect(component.filterAuthor).toBe('newContent');
    expect(component.filterContent).toBe('');
    expect(component.filterDate).toBe('2023-10-02');
  });
});
