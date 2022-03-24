export class UserAddress {
  _id?: string;
  default: boolean;
  addressLine1: string;
  city: string;
  state: string;
  pincode: number;
  constructor(data: Partial<UserAddress> = {}) {
    this._id = data._id;
    this.default = !!data.default;
    this.addressLine1 = data.addressLine1;
    this.city = data.city;
    this.state = data.state;
    this.pincode = data.pincode;
  }
}

export class User {
  _id: string;
  isSuperAdmin: boolean;
  username: string;
  email: string;

  addresses: UserAddress[];
  constructor(data: Partial<User> = {}) {
    this._id = data._id;
    this.email = data.email;
    this.isSuperAdmin = data.isSuperAdmin;
    this.username = data.username;
    this.addresses = data.addresses.reduce((acc, address) => {
      acc.push(new UserAddress(address));
      return acc;
    }, []);
  }
}
