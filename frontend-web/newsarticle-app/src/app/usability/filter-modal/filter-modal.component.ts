import { Component, EventEmitter, Output } from '@angular/core';
import {MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    FormsModule,
    MatButton,
    MatLabel,
    MatDialogContent,
    MatDialogTitle,
    MatDialogModule
  ],
  styleUrls: ['./filter-modal.component.css']
})
export class FilterModalComponent {
  filterAuthor: string = '';
  filterContent: string = '';
  filterDate: string = '';

  @Output() filterApplied = new EventEmitter<any>();

  constructor(public dialogRef: MatDialogRef<FilterModalComponent>) {}

  applyFilter(): void {
    const filterData = {
      filterAuthor: this.filterAuthor,
      filterContent: this.filterContent,
      filterDate: this.filterDate
    };
    this.filterApplied.emit(filterData);
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
