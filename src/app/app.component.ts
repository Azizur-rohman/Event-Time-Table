import { Component } from '@angular/core';
import { TimetableComponent } from './timetable/timetable.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TimetableComponent],
  template: `<app-timetable></app-timetable>`
})
export class AppComponent {}
