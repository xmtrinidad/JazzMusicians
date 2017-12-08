import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';

interface Nav {
  name: string;
  link: string;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  navItems: Nav[] = [
    {name: 'saxophonist', link: ''},
    {name: 'pianist', link: ''},
    {name: 'trumpeters', link: ''},
    {name: 'guitarist', link: ''},
  ];

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
  }

  onInstrumentSelect(instrument) {
    this.databaseService.selectedInstrument.next(instrument);
  }

}
