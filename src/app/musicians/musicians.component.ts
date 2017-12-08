import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Musician } from '../models/musician';

@Component({
  selector: 'app-musicians',
  templateUrl: './musicians.component.html',
  styleUrls: ['./musicians.component.scss']
})
export class MusiciansComponent implements OnInit {
  musicians: any;
  instrument: any;

  constructor(private databaseService: DatabaseService) {
  }

  ngOnInit() {
    // Initial/default musicians
    this.databaseService.getMusicians(`pianist`).subscribe(m => {
      this.musicians = m;
      this.databaseService.selectedMusician.next(m[0]);
      this.instrument = 'pianist';
    });
    // Subscribe to changes
    this.databaseService.selectedInstrument.subscribe(instrument => {
      this.databaseService.getMusicians(`${instrument}`).subscribe(m => {
        this.instrument = instrument;
        this.musicians = m;
        // set selected musician to show a musician when list changes
        this.databaseService.selectedMusician.next(m[0]);
      });
    });
  }

  onMusicianSelect(clicked) {
    this.databaseService.selectedMusician.next(clicked);
  }

}
