import { Injectable } from '@angular/core';
import { Card } from '../models/Card.model';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class BusinesscardsService {

  // realtime database stuff
  database: Card[];
  realtimeDatabase: AngularFireList<Card>;
  fireDBPath = 'businessCardList';

  // firestore database stuff
  private afsDBPath = 'businesscards';
  firestoreCards: Observable<Card[]>;
  firestoreCardsCollection: AngularFirestoreCollection<Card>;

  constructor(private fireDB: AngularFireDatabase, private afs: AngularFirestore) {
    // realtime database
    this.realtimeDatabase = fireDB.list(this.fireDBPath);
    // firestore database
    this.firestoreCardsCollection = afs.collection<Card>(this.afsDBPath);
    this.firestoreCards = this.firestoreCardsCollection.valueChanges();
  }



  /* --------- REALTIME DATABASE METHODS ---------*/
  addCard(cd: Card): void {
    const myid = this.afs.createId();
    cd.id = myid;
    this.realtimeDatabase.push(cd);
  }

  // Delete Method
  deleteCard(cardID: string): Promise<void> {
     return this.realtimeDatabase.remove(cardID);
  }

  // Delete All
  deleteAll() {
    this.realtimeDatabase.remove();
  }

  // Update Method

  // get all cards
  getBusinessCards(): AngularFireList<Card> {
    return this.realtimeDatabase;
  }

/* --------- END OF REALTIME DATABASE METHODS---------*/







/* --------- FIRESTORE DATABASE METHODS --------- */
  addBCard(newBusinessCard: Card): Promise<void> {
    const id = this.afs.createId();
    newBusinessCard.id = id;
    return this.firestoreCardsCollection.doc(id).set(Object.assign({}, newBusinessCard));
  }

  updateBCard(id: string, update: Card): Promise<void> {
    return this.firestoreCardsCollection.doc(id).update(Object.assign({}, update));
  }

  deleteBCard(id: string): Promise<void> {
    return this.firestoreCardsCollection.doc(id).delete();
  }

  getBCardsCollection(): AngularFirestoreCollection<Card> {
    return this.firestoreCardsCollection;
  }


/* --------- END OF FIRESTORE DATABASE METHODS---------*/
}
