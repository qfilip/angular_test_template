export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  address: Address;
}

export interface Address {
  id?: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}
