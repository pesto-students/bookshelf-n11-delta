import {AnyObject} from 'yup/lib/object';

export class NameId {
  _id: number;
  name: string;

  constructor(data: AnyObject = {}) {
    this._id = data._id;
    this.name = data.name;
  }
}
