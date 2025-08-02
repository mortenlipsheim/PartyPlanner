export type Neighbor = {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
};

export type Party = {
  id: string;
  name: string;
  description: string;
  date: Date;
  place: string;
  menu: string[];
  comments: string;
  attendees: string[]; // Array of neighbor IDs
};
