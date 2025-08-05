import React, { createContext, useContext, useReducer, useEffect } from 'react';
import RealmDatabase from '../database/RealmDatabase';
import NotificationService from '../services/NotificationService';

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: null,
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ITEMS: 'SET_ITEMS',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SELECTED_CATEGORY: 'SET_SELECTED_CATEGORY',
};

// Reducer function
function itemReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ActionTypes.SET_ITEMS:
      return { ...state, items: action.payload, loading: false, error: null };
    case ActionTypes.ADD_ITEM:
      return { ...state, items: [action.payload, ...state.items] };
    case ActionTypes.UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case ActionTypes.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case ActionTypes.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case ActionTypes.SET_SELECTED_CATEGORY:
      return { ...state, selectedCategory: action.payload };
    default:
      return state;
  }
}

// Create context
const ItemContext = createContext();

// Context provider component
export function ItemProvider({ children }) {
  const [state, dispatch] = useReducer(itemReducer, initialState);

  // Initialize database and load items
  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      await RealmDatabase.initialize();
      await NotificationService.initialize();
      loadItems();
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    }
  };

  const loadItems = () => {
    try {
      const items = RealmDatabase.getAllItems();
      dispatch({ type: ActionTypes.SET_ITEMS, payload: Array.from(items) });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    }
  };

  const addItem = async (itemData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const newItem = RealmDatabase.createItem(itemData);
      
      // Schedule notifications for the new item
      await NotificationService.scheduleItemNotifications(newItem);
      
      dispatch({ type: ActionTypes.ADD_ITEM, payload: newItem });
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      return newItem;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updateItem = async (id, updateData) => {
    try {
      const updatedItem = RealmDatabase.updateItem(id, updateData);
      if (updatedItem) {
        // Cancel old notifications and schedule new ones
        await NotificationService.cancelItemNotifications(id);
        await NotificationService.scheduleItemNotifications(updatedItem);
        
        dispatch({ type: ActionTypes.UPDATE_ITEM, payload: updatedItem });
      }
      return updatedItem;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const markAsReplaced = async (id) => {
    try {
      const updatedItem = RealmDatabase.markAsReplaced(id);
      if (updatedItem) {
        // Cancel old notifications and schedule new ones with updated start date
        await NotificationService.cancelItemNotifications(id);
        await NotificationService.scheduleItemNotifications(updatedItem);
        
        dispatch({ type: ActionTypes.UPDATE_ITEM, payload: updatedItem });
      }
      return updatedItem;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const removeItem = async (id) => {
    try {
      const success = RealmDatabase.removeItem(id);
      if (success) {
        // Cancel all notifications for this item
        await NotificationService.cancelItemNotifications(id);
        
        dispatch({ type: ActionTypes.REMOVE_ITEM, payload: id });
      }
      return success;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const searchItems = (query) => {
    dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: query });
    if (query.trim() === '') {
      loadItems();
    } else {
      try {
        const searchResults = RealmDatabase.searchItems(query);
        dispatch({ type: ActionTypes.SET_ITEMS, payload: Array.from(searchResults) });
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      }
    }
  };

  const filterByCategory = (category) => {
    dispatch({ type: ActionTypes.SET_SELECTED_CATEGORY, payload: category });
    if (!category) {
      loadItems();
    } else {
      try {
        const filteredItems = RealmDatabase.getItemsByCategory(category);
        dispatch({ type: ActionTypes.SET_ITEMS, payload: Array.from(filteredItems) });
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      }
    }
  };

  const getCategories = () => {
    try {
      return RealmDatabase.getCategories();
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  };

  const getExpiringSoonItems = () => {
    try {
      return RealmDatabase.getExpiringSoonItems();
    } catch (error) {
      console.error('Error getting expiring soon items:', error);
      return [];
    }
  };

  const clearFilters = () => {
    dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: '' });
    dispatch({ type: ActionTypes.SET_SELECTED_CATEGORY, payload: null });
    loadItems();
  };

  const value = {
    ...state,
    addItem,
    updateItem,
    markAsReplaced,
    removeItem,
    searchItems,
    filterByCategory,
    getCategories,
    getExpiringSoonItems,
    clearFilters,
    refreshItems: loadItems,
  };

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
}

// Custom hook to use the context
export function useItems() {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemProvider');
  }
  return context;
}

export default ItemContext;

