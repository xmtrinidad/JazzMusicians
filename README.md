# JazzMusicians

Project Link:   
https://xmtrinidad.github.io/JazzMusicians/

## Uplabs Mockup

The mockup for this project can be found [here](https://www.uplabs.com/posts/impersionism).

My goal is to change to a carousel for mobile layouts.  I'll be using the [ngx-carousel](https://github.com/sheikalthaf/ngx-carousel) for this.

## Goals

* Get more experience using the [Angular Material](https://material.angular.io/) framework
* Use [Firestore](https://firebase.google.com/docs/firestore/) as a backend for displaying content
* using [Subjects](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/subjects.md) for cross component communication

## Docs

Anything new I learn or anything I need to review will be documented below:

**Table of Contents**       
[Using Firestore as a Backend to Store Data](#using-firestore-as-a-backend-to-store-data)       
[RxJS Subjects for Cross Component Communication](#rxjs-subjects-for-cross-component-communication)       

## Using Firestore as a Backend to Store Data

### Initial Setup

When using any Firebase applications, [Angularfire2](https://github.com/angular/angularfire2) must be installed.  Angularfire2 is the official Angular library for Angular2+.

Most of the initial set-up can be found on the [AngularFire github page](https://github.com/angular/angularfire2/blob/master/docs/install-and-setup.md)

Assuming that the Angular CLI is installed the steps are as follows:

1.  Install AngularFire via NPM with the following command:
    ```
    npm install angularfire2 firebase --save
    ```

2.  Create a new project in the Firebase console.  After initial set-up, there will be a popup with the config for the created firebase app that looks something like below:
    ```
    apiKey: '<your-key>',
    authDomain: '<your-project-authdomain>',
    databaseURL: '<your-database-URL>',
    projectId: '<your-project-id>',
    storageBucket: '<your-storage-bucket>',
    messagingSenderId: '<your-messaging-sender-id>'
    ```
This firebase config information should be placed in ```/src/environments/environment.ts```:

```
export const environment = {
    production: false,
    firebase: {
            apiKey: '<your-key>',
            authDomain: '<your-project-authdomain>',
            databaseURL: '<your-database-URL>',
            projectId: '<your-project-id>',
            storageBucket: '<your-storage-bucket>',
            messagingSenderId: '<your-messaging-sender-id>'
        }
    };
```

3.  To use Angularfire in the application, the AngularfireModule needs to be imported into the app.module and initialized with the configuration information added to the environment.ts file.
    ```javascript
    import { AngularFireModule } from 'angularfire2';
    import { environment } from '../environments/environment';
    ...
    @NgModule({
        imports: [
            AngularFireModule.initializeApp(environment.firebase)
        ]
    })
    ```

    Note the *environment* import which is needed so that *AngularFireModule.initializeApp()* can access the configuration information.

4.  *Firestore* is the database aspect of the suite of products offered from Firebase.  To use *Firestore* in the application, it needs to be imported into app.module and added to imports as well:
    ```javascript
    import { AngularFirestoreModule } from 'angularfire2/firestore';
    ...
    @NgModule({
        imports: [
            // Other imports above
            AngularFirestoreModule
        ]
    })
    ```

5.  Inject AngularFirestore into the component or service that will be using the database.  For this project, I created a service file to handle anything involving the Firestore database:
    ```
    import { Injectable } from '@angular/core';
    import { AngularFirestore} from 'angularfire2/firestore';

    @Injectable()
    export class DatabaseService {
    
    // AngularFirestore is injected here
    constructor(private db: AngularFirestore) {}

    }
    ```

### Accessing Collections

The Firestore database is organized into Collections and Documents.  For this project, I have four collections named after instruments (guitarist, pianist, saxophonist, trumpeters).

Each collection has five Documents associated with it and within that document is musician information.

To access the Documents within a Collection, it only takes one line:
```javascript
this.musicians = this.db.collection(`${instrument}`).valueChanges();
```

In the case of this application, the collection changes based on the selected instrument.  The key takeaway is that the database is accessed from the variable that was injected with the AngularFirestore (*this.db*), the .collection() method is used to get the collection provided in the parameter (```collection(`${instrument}`)```) then the Documents associated with that collection are accessed using the *valueChanges()* method

### Nested Collections and Documents

Every musician in this project has associated record/album data that is displayed.  In Firestore, this information is stored in nested Collections and Documents.

To access nested collections and documents, AngularFirestoreDocument needs to be imported:
```
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
```

A variable needs to be declared that will hold the information about the specific document:
```typescript
musicianDoc: AngularFirestoreDocument<Music>;
```

Inside my service I have a *getMusicianMusic()* method that takes in an id as a parameter.  

*Side note: Every Document in the database has an associated id that I set equal to the document id manually.  It's possible to do this dynamically, but for the purpose of this project, inputing the ID manually via firebase was more efficient.*

Inside the method, *musicianDoc* is set to the Document of the musician with the id passed in:
```typescript
getMusicianMusic(id) {
    this.musicianDoc = this.db.doc<Music>(`${this.currentInstrument}/${id}`);
  }
```

Again, the *db* variable that access the AngularFirestore is used then the *doc()* method (which should be of type Music) is used to access the document based on the id.

Inside every Document there is a nested collection called 'records' and accessing that collection uses the same method from earlier; using the .collection() and .valueChanges() methods:
```typescript
getMusicianMusic(id) {
    this.musicianDoc = this.db.doc<Music>(`${this.currentInstrument}/${id}`);
    return this.musicianDoc.collection<Music[]>('records').valueChanges();
  }
```

As before, the *collection()* method is used to get the 'records' collection and *valueChanges()* gets all the associated Documents associated with that collection.  For this application, the collection of documents is returned and set to a variable in another component.




## RxJS Subjects for Cross Component Communication

In previous projects I used EventEmitters to listen to changes in other components.  While this works, I've since found out that using [RxJS Subject](http://reactivex.io/documentation/subject.html)  are a better approach.  This was the main reason why I started this project; to get practice using Subjects

### What is a Subject?

A Subject is similar to an Observable, but can be an Observer and Observable at the same time.  

By being an Observer, the *next()* method can be used and data can be passed into it.

By being an Observable, the Subject can be subscribed to.  By subscribing to the Observable, the data stream can be accessed and any changes or updates made would be shown immediately.

By using a Subject, the Observer part can be setup in another component and the Observable part can be used in another component, thus achieving cross component communication

### Subject Example

This project uses Subjects to get the *selectedInstrument* from the nav menu and to get the *selectedMusician* from the Musicians component.

These two Subjects are initially set up in the database.service.ts file:
```typescript
selectedInstrument = new Subject; // Change musicians from nav select
selectedMusician = new Subject; // Change musician from list of musicians
```

Inside the nav component there is an *onInstrumentSelect()* method that takes in the selected instrument from the nav menu as a parameter.  This is the method where the Observer part of the Subject is used:
```typescript
onInstrumentSelect(instrument) {
    this.databaseService.selectedInstrument.next(instrument);
}
```

The instrument (a string) is passed into the data stream using the .next() method.

In the musicians.component.ts file, the Observable part of the selectedMusician Subject is used; it is subscribed to and the data is used to get musicians based on the instrument selected:
```typescript
this.databaseService.selectedInstrument.subscribe(instrument => {
    this.databaseService.getMusicians(`${instrument}`) //...
```

Using a Subject in this way achieves cross component communication and, because it's an Observable, any changes will be reflected automatically when the data value changes.
