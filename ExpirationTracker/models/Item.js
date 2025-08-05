import Realm from 'realm';

export class Item extends Realm.Object {
  static schema = {
    name: 'Item',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      description: 'string?',
      startDate: 'date',
      expirationDays: 'int',
      category: 'string?',
      isActive: { type: 'bool', default: true },
      createdAt: { type: 'date', default: () => new Date() },
      updatedAt: { type: 'date', default: () => new Date() },
    },
  };

  // Computed property to get expiration date
  get expirationDate() {
    const expDate = new Date(this.startDate);
    expDate.setDate(expDate.getDate() + this.expirationDays);
    return expDate;
  }

  // Computed property to get remaining days
  get remainingDays() {
    const today = new Date();
    const expDate = this.expirationDate;
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Check if item is expired
  get isExpired() {
    return this.remainingDays < 0;
  }

  // Check if item is expiring soon (within 3 days)
  get isExpiringSoon() {
    return this.remainingDays <= 3 && this.remainingDays >= 0;
  }
}

export default Item;

