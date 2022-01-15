import {AnyObject} from 'yup/lib/object';

export class NameId {
  id: number;
  name: string;

  constructor(data: AnyObject = {}) {
    this.id = data.id;
    this.name = data.name;
  }
}
