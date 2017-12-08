import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Musician } from '../models/musician';
import { Subject } from 'rxjs/Subject';
import { Music } from '../models/music';

@Injectable()
export class DatabaseService {
  musicians: Observable<any[]>;
  selectedInstrument = new Subject; // Change musicians from nav select
  selectedMusician = new Subject; // Change musician from list of musicians

  musicianDoc: AngularFirestoreDocument<Music>;
  musicianMusic: Music;
  currentInstrument: string;

  constructor(
    private db: AngularFirestore) {
  }

  /**
   * Get musicians associated with instrument selected
   * @param instrument - the selected instrument
   */
  getMusicians(instrument) {
    this.currentInstrument = instrument;
    this.musicians = this.db.collection(`${instrument}`).valueChanges();
    return this.musicians;
  }

  /**
   * Get nested collection of records for selected muscian
   * @param id - the id of the selected musician
   */
  getMusicianMusic(id) {
    this.musicianDoc = this.db.doc<Music>(`${this.currentInstrument}/${id}`);
    return this.musicianDoc.collection<Music[]>('records').valueChanges();
  }

}
