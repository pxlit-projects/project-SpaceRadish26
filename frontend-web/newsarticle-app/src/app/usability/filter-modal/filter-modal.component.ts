// src/app/usability/filter-modal/filter-modal.component.ts
import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatDialogActions,
    FormsModule,
    MatButton,
    MatDialogContent,
    MatDialogTitle,
    MatLabel
  ],
  styleUrls: ['./filter-modal.component.css']
})
export class FilterModalComponent {
  filterAuthor: string = '';
  filterContent: string = '';
  filterDate: string = '';

  constructor(public dialogRef: MatDialogRef<FilterModalComponent>) {}

  applyFilter(): void {
    this.dialogRef.close({
      filterAuthor: this.filterAuthor,
      filterContent: this.filterContent,
      filterDate: this.filterDate
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
