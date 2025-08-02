'use server';

import fs from 'fs/promises';
import path from 'path';
import { Neighbor } from './types';
import { v4 as uuidv4 } from 'uuid';

const neighborsFilePath = path.join(process.cwd(), 'data', 'neighbors.json');

const readNeighborsFile = async (): Promise<Neighbor[]> => {
  try {
    const data = await fs.readFile(neighborsFilePath, 'utf-8');
    // Handle empty file
    if (data.trim() === '') {
      return [];
    }
    return JSON.parse(data) as Neighbor[];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return []; // File does not exist, return empty array
    }
    throw error;
  }
};

const writeNeighborsFile = async (data: Neighbor[]) => {
  await fs.writeFile(neighborsFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

export const getNeighbors = async (): Promise<Neighbor[]> => {
  return await readNeighborsFile();
};

export const createNeighbor = async (neighborData: Omit<Neighbor, 'id'>) => {
    const neighbors = await readNeighborsFile();
    const newNeighbor: Neighbor = { id: uuidv4(), ...neighborData };
    neighbors.push(newNeighbor);
    await writeNeighborsFile(neighbors);
    return newNeighbor;
};

export const updateNeighbor = async (id: string, neighborData: Partial<Omit<Neighbor, 'id'>>) => {
    const neighbors = await readNeighborsFile();
    const index = neighbors.findIndex(n => n.id === id);
    if (index === -1) {
        throw new Error('Neighbor not found');
    }
    neighbors[index] = { ...neighbors[index], ...neighborData };
    await writeNeighborsFile(neighbors);
    return neighbors[index];
};

export const deleteNeighbor = async (id: string) => {
    let neighbors = await readNeighborsFile();
    const initialLength = neighbors.length;
    neighbors = neighbors.filter(n => n.id !== id);
    if (neighbors.length === initialLength) {
      console.warn(`Neighbor with id ${id} not found for deletion.`);
    }
    await writeNeighborsFile(neighbors);
};