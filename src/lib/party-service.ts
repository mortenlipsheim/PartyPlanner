'use server';

import fs from 'fs/promises';
import path from 'path';
import { Party } from './types';
import { v4 as uuidv4 } from 'uuid';

const partiesFilePath = path.join(process.cwd(), 'data', 'parties.json');

const readPartiesFile = async (): Promise<Party[]> => {
    try {
        const fileContents = await fs.readFile(partiesFilePath, 'utf-8');
        // Handle empty file
        if (fileContents.trim() === '') {
            return [];
        }
        const parties = JSON.parse(fileContents);
        // Dates are stored as ISO strings in JSON, so we need to convert them back to Date objects
        return parties.map((p: Party) => ({
            ...p,
            date: new Date(p.date),
        }));
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return []; // File doesn't exist, return empty array
        }
        throw error;
    }
};

const writePartiesFile = async (data: Party[]) => {
    await fs.writeFile(partiesFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

export const getParties = async (): Promise<Party[]> => {
    return await readPartiesFile();
};

export const getParty = async (id: string): Promise<Party | null> => {
    const parties = await readPartiesFile();
    const party = parties.find(p => p.id === id);
    if (!party) return null;
    return { ...party, date: new Date(party.date) };
};

export const createParty = async (partyData: Omit<Party, 'id'>) => {
    const parties = await readPartiesFile();
    const newParty: Party = { id: uuidv4(), ...partyData };
    parties.push(newParty);
    await writePartiesFile(parties);
    return newParty;
};

export const updateParty = async (id: string, partyData: Partial<Omit<Party, 'id'>>) => {
    const parties = await readPartiesFile();
    const index = parties.findIndex(p => p.id === id);
    if (index === -1) {
        throw new Error('Party not found');
    }
    // Make sure date is not stringified if it's already a Date object
    const updatedParty = { ...parties[index], ...partyData };
    if (typeof updatedParty.date === 'string') {
        updatedParty.date = new Date(updatedParty.date);
    }
    
    parties[index] = updatedParty;
    await writePartiesFile(parties);
    return parties[index];
};

export const deleteParty = async (id: string) => {
    let parties = await readPartiesFile();
    parties = parties.filter(p => p.id !== id);
    await writePartiesFile(parties);
};

export const updateAttendeeStatus = async (partyId: string, neighborId: string, status: 'attending' | 'declined') => {
    const party = await getParty(partyId);
    if (!party) {
      throw new Error('Party not found');
    }
  
    const attendeeIndex = party.attendees.findIndex(a => a.neighborId === neighborId);
  
    if (attendeeIndex === -1) {
      // This can happen if the link is clicked but they weren't formally invited via the app
      // For robustness, we can add them.
      party.attendees.push({ neighborId, status });
    } else {
      // If they declined, remove any item they were bringing
      if (status === 'declined' && party.attendees[attendeeIndex].status === 'attending') {
          party.menu.forEach(item => {
              if (item.broughtBy === neighborId) {
                  item.broughtBy = null;
              }
          });
      }
      party.attendees[attendeeIndex].status = status;
    }
  
    return await updateParty(partyId, { attendees: party.attendees, menu: party.menu });
};

export const assignMenuItem = async (partyId: string, menuItemName: string, neighborId: string) => {
    const party = await getParty(partyId);
    if (!party) {
        throw new Error('Party not found');
    }

    // Ensure the neighbor is actually attending
    const attendee = party.attendees.find(a => a.neighborId === neighborId && a.status === 'attending');
    if (!attendee) {
        throw new Error('Neighbor is not confirmed as attending this party.');
    }

    const menuItem = party.menu.find(item => item.name === menuItemName);
    if (!menuItem) {
        throw new Error('Menu item not found');
    }

    // Check if the item is already taken
    if (menuItem.broughtBy !== null) {
        throw new Error('This item is already being brought by someone else.');
    }
    
    // Unassign any other item this neighbor was bringing
    party.menu.forEach(item => {
        if (item.broughtBy === neighborId) {
            item.broughtBy = null;
        }
    });

    // Assign the new item
    menuItem.broughtBy = neighborId;

    await updateParty(partyId, { menu: party.menu });

    return party;
};
