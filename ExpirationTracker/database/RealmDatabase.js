import Realm from 'realm';
import { Item } from '../models/Item';

class RealmDatabase {
  constructor() {
    this.realm = null;
  }

  async initialize() {
    try {
      this.realm = await Realm.open({
        schema: [Item],
        schemaVersion: 1,
      });
      console.log('Realm database initialized successfully');
    } catch (error) {
      console.error('Error initializing Realm database:', error);
      throw error;
    }
  }

  // Create a new item
  createItem(itemData) {
    try {
      let newItem;
      this.realm.write(() => {
        newItem = this.realm.create('Item', {
          id: this.generateId(),
          name: itemData.name,
          description: itemData.description || '',
          startDate: itemData.startDate || new Date(),
          expirationDays: itemData.expirationDays,
          category: itemData.category || 'General',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
      return newItem;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  }

  // Get all active items
  getAllItems() {
    try {
      return this.realm.objects('Item').filtered('isActive == true').sorted('createdAt', true);
    } catch (error) {
      console.error('Error getting all items:', error);
      return [];
    }
  }

  // Get item by ID
  getItemById(id) {
    try {
      return this.realm.objectForPrimaryKey('Item', id);
    } catch (error) {
      console.error('Error getting item by ID:', error);
      return null;
    }
  }

  // Update an item
  updateItem(id, updateData) {
    try {
      const item = this.getItemById(id);
      if (item) {
        this.realm.write(() => {
          Object.keys(updateData).forEach(key => {
            if (key !== 'id') {
              item[key] = updateData[key];
            }
          });
          item.updatedAt = new Date();
        });
        return item;
      }
      return null;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  // Mark item as replaced (reset start date)
  markAsReplaced(id) {
    try {
      const item = this.getItemById(id);
      if (item) {
        this.realm.write(() => {
          item.startDate = new Date();
          item.updatedAt = new Date();
        });
        return item;
      }
      return null;
    } catch (error) {
      console.error('Error marking item as replaced:', error);
      throw error;
    }
  }

  // Remove an item (soft delete)
  removeItem(id) {
    try {
      const item = this.getItemById(id);
      if (item) {
        this.realm.write(() => {
          item.isActive = false;
          item.updatedAt = new Date();
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  }

  // Search items by name
  searchItems(query) {
    try {
      return this.realm.objects('Item')
        .filtered('isActive == true AND name CONTAINS[c] $0', query)
        .sorted('createdAt', true);
    } catch (error) {
      console.error('Error searching items:', error);
      return [];
    }
  }

  // Filter items by category
  getItemsByCategory(category) {
    try {
      return this.realm.objects('Item')
        .filtered('isActive == true AND category == $0', category)
        .sorted('createdAt', true);
    } catch (error) {
      console.error('Error getting items by category:', error);
      return [];
    }
  }

  // Get all unique categories
  getCategories() {
    try {
      const items = this.realm.objects('Item').filtered('isActive == true');
      const categories = new Set();
      items.forEach(item => {
        if (item.category) {
          categories.add(item.category);
        }
      });
      return Array.from(categories).sort();
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  // Get items expiring soon
  getExpiringSoonItems() {
    try {
      const items = this.getAllItems();
      return items.filter(item => item.isExpiringSoon);
    } catch (error) {
      console.error('Error getting expiring soon items:', error);
      return [];
    }
  }

  // Get expired items
  getExpiredItems() {
    try {
      const items = this.getAllItems();
      return items.filter(item => item.isExpired);
    } catch (error) {
      console.error('Error getting expired items:', error);
      return [];
    }
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Close database connection
  close() {
    if (this.realm && !this.realm.isClosed) {
      this.realm.close();
    }
  }
}

export default new RealmDatabase();

