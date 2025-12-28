import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {

  venues = [
    { name: 'Venue 1' },
    { name: 'Venue 2' },
    { name: 'Venue 3' }
  ];

  venueWidth = 200;
  minuteHeight = 2;
  startHour = 9;
  timeSlots: string[] = [];

events: any[] = [
  { date: '2025-12-01', title: 'Event 1', start: '09:00', end: '09:30', venueIndexes: [0] },
  { date: '2025-12-01', title: 'Event 2', start: '10:00', end: '10:30', venueIndexes: [0, 1] },
  { date: '2025-12-01', title: 'Event 3', start: '09:45', end: '11:00', venueIndexes: [2] },
  { date: '2025-12-03', title: 'Event 1', start: '09:00', end: '09:30', venueIndexes: [0] },
  { date: '2025-12-07', title: 'Event 2', start: '10:00', end: '10:30', venueIndexes: [0] },
  { date: '2025-12-05', title: 'Event 3', start: '09:45', end: '11:00', venueIndexes: [1,2] }
];


  filteredEvents: any[] = [];

  days: { dayName: string, date: string }[] = [];
  selectedDay: string = '';

  ngOnInit() {
    this.generateDays(2025, 12);
    this.selectedDay = this.days[0].date;
    this.filterEvents();
    this.generateTimeSlots();
    this.calculateEventPosition();
  }

  generateDays(year: number, month: number) {
    const date = new Date(year, month - 1, 1);
    this.days = [];
    while (date.getMonth() === month - 1) {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dayNum = date.getDate().toString().padStart(2, '0');
      const monthNum = (date.getMonth() + 1).toString().padStart(2, '0');
      const isoDate = `${year}-${monthNum}-${dayNum}`;
      this.days.push({ dayName, date: isoDate });
      date.setDate(date.getDate() + 1);
    }
  }

  generateTimeSlots() {
    this.timeSlots = [];
    const start = this.startHour * 60;
    const end = 18 * 60; // 6:00 PM
    for (let i = start; i <= end; i += 15) {
      const h = Math.floor(i / 60);
      const m = i % 60;
      this.timeSlots.push(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`);
    }
  }

calculateEventPosition() {
  this.filteredEvents.forEach(e => {
    const startMin = this.toMinutes(e.start);
    const endMin = this.toMinutes(e.end);
    e.top = Math.round((startMin - this.startHour * 60) * this.minuteHeight);
    e.height = Math.round((endMin - startMin) * this.minuteHeight);
    e.height = e.height + 30
  });
}

toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}


  onDayChange(event: MatTabChangeEvent) {
    this.selectedDay = this.days[event.index].date;
    this.filterEvents();
    this.calculateEventPosition();
  }

  filterEvents() {
    this.filteredEvents = this.events.filter(e => e.date === this.selectedDay);
  }

 getEventsByVenue(index: number) {
  return this.filteredEvents.filter(e => e.venueIndexes.includes(index));
}


  isEventInSlot(e: any, slot: string) {
  return slot >= e.start && slot < e.end;
}

getEventStyle(e: any) {
  const leftIndex = Math.min(...e.venueIndexes);
  const width = e.venueIndexes.length * this.venueWidth;
  // Add 60px offset for the time column
  const left = 60 + leftIndex * this.venueWidth;
  return { left, width };
}


}
