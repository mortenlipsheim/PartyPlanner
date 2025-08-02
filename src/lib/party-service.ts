import { db } from './firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { Party } from './types';

const partyCollection = collection(db, 'parties');

const fromFirestore = (doc: any): Party => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    date: (data.date as Timestamp).toDate(),
  };
};

export const getParties = async (): Promise<Party[]> => {
  const snapshot = await getDocs(partyCollection);
  return snapshot.docs.map(fromFirestore);
};

export const getParty = async (id: string): Promise<Party | null> => {
    const partyDoc = doc(db, 'parties', id);
    const partySnap = await getDoc(partyDoc);
    if (partySnap.exists()) {
      return fromFirestore(partySnap);
    }
    return null;
  };

export const createParty = async (party: Omit<Party, 'id'>) => {
  return await addDoc(partyCollection, party);
};

export const updateParty = async (id: string, party: Partial<Omit<Party, 'id'>>) => {
  const partyDoc = doc(db, 'parties', id);
  return await updateDoc(partyDoc, party);
};

export const deleteParty = async (id: string) => {
  const partyDoc = doc(db, 'parties', id);
  return await deleteDoc(partyDoc);
};

export const updateAttendeeStatus = async (partyId: string, neighborId: string, status: 'attending' | 'declined') => {
    const party = await getParty(partyId);
    if (!party) {
      throw new Error('Party not found');
    }
  
    const attendeeIndex = party.attendees.findIndex(a => a.neighborId === neighborId);
  
    if (attendeeIndex === -1) {
      throw new Error('Attendee not found in invitation list');
    }
  
    const updatedAttendees = [...party.attendees];
    updatedAttendees[attendeeIndex].status = status;
  
    return await updateParty(partyId, { attendees: updatedAttendees });
  };