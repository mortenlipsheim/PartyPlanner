import { db } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { Neighbor } from './types';

const neighborCollection = collection(db, 'neighbors');

const fromFirestore = (doc: any): Neighbor => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
  };
};

export const getNeighbors = async (): Promise<Neighbor[]> => {
  const snapshot = await getDocs(neighborCollection);
  return snapshot.docs.map(fromFirestore);
};

export const createNeighbor = async (neighbor: Omit<Neighbor, 'id'>) => {
  return await addDoc(neighborCollection, neighbor);
};

export const updateNeighbor = async (id: string, neighbor: Partial<Omit<Neighbor, 'id'>>) => {
  const neighborDoc = doc(db, 'neighbors', id);
  return await updateDoc(neighborDoc, neighbor);
};

export const deleteNeighbor = async (id: string) => {
  const neighborDoc = doc(db, 'neighbors', id);
  return await deleteDoc(neighborDoc);
};
