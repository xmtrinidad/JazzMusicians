import { Component, OnInit } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
import { Musician } from '../models/musician';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-selected-musician',
  templateUrl: './selected-musician.component.html',
  styleUrls: ['./selected-musician.component.scss']
})
export class SelectedMusicianComponent implements OnInit {
  selectedMusician: any;
  records: any;
  carouselOne: NgxCarousel;

  constructor(private databaseService: DatabaseService) { }
    ngOnInit() {
      // Set selected musician
      this.databaseService.selectedMusician.subscribe((musician) => {
        this.selectedMusician = musician;
        this.databaseService.getMusicianMusic(this.selectedMusician.id)
          .subscribe(music => this.records = music);
      });
      this.carouselOne = {
        grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
        slide: 1,
        speed: 400,
        interval: 4000,
        point: {
          visible: true
        },
        load: 2,
        touch: true,
        loop: true,
        custom: 'banner'
      };
    }

    public myfunc(event: Event) {
    }

}
