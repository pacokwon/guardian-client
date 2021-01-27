export interface Pet {
  id: string;
  nickname: string;
  imageUrl: string;
  species: string;
}

export interface User {
  id: string;
  nickname: string;
}

export interface UserPetHistory {
  id: string;
  releasedAt: Date;
  registeredAt: Date;
  released: boolean;
  user: User;
  pet: Pet;
}

export type Node<T> = { node: T };
