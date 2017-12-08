import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedMusicianComponent } from './selected-musician.component';

describe('SelectedMusicianComponent', () => {
  let component: SelectedMusicianComponent;
  let fixture: ComponentFixture<SelectedMusicianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedMusicianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedMusicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
