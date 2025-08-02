export type RSVPStatus = 'invited' | 'attending' | 'declined';

export interface Attendee {
  neighborId: string;
  status: RSVPStatus;
}

export interface MenuItem {
  name: string;
  broughtBy: string | null; // neighborId
}

export type Neighbor = {
  id: string;
  name: string;
  address: string;
  email: string | undefined;
  phone: string | undefined;
};

export type Party = {
  id: string;
  name: string;
  description: string;
  date: Date;
  place: string;
  menu: MenuItem[];
  comments?: string;
  attendees: Attendee[];
};
