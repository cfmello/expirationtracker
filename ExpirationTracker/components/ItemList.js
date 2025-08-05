import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { useItems } from '../context/ItemContext';
import SearchAndFilter from './SearchAndFilter';

const ItemList = ({ navigation }) => {
  const { 
    items, 
    loading, 
    error, 
    searchQuery, 
    selectedCategory, 
    searchItems, 
    clearFilters 
  } = useItems();
  
  const [showSearchFilter, setShowSearchFilter] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleQuickSearch = (query) => {
    setLocalSearchQuery(query);
    searchItems(query);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        item.isExpired && styles.expiredItem,
        item.isExpiringSoon && styles.expiringSoonItem,
      ]}
      onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.category && (
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description || 'No description'}
        </Text>
        
        <View style={styles.daysContainer}>
          {item.isExpired ? (
            <Text style={styles.expiredText}>Expired!</Text>
          ) : (
            <Text style={[
              styles.daysText,
              item.isExpiringSoon && styles.expiringSoonText
            ]}>
              {item.remainingDays} days remaining
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Quick Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={localSearchQuery}
          onChangeText={handleQuickSearch}
          placeholder="Quick search..."
          placeholderTextColor="#9e9e9e"
          clearButtonMode="while-editing"
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowSearchFilter(true)}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Active Filters Display */}
      {(searchQuery || selectedCategory) && (
        <View style={styles.activeFiltersContainer}>
          <View style={styles.activeFilters}>
            {searchQuery && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>"{searchQuery}"</Text>
              </View>
            )}
            {selectedCategory && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>{selectedCategory}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={() => {
              setLocalSearchQuery('');
              clearFilters();
            }}
          >
            <Text style={styles.clearFiltersText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
          {(searchQuery || selectedCategory) && ' found'}
        </Text>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      {searchQuery || selectedCategory ? (
        <>
          <Text style={styles.emptyText}>No items found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search or filters
          </Text>
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={() => {
              setLocalSearchQuery('');
              clearFilters();
            }}
          >
            <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.emptyText}>No items tracked yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to add your first item
          </Text>
        </>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
      
      <SearchAndFilter
        visible={showSearchFilter}
        onClose={() => setShowSearchFilter(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Space for FAB
  },
  headerContainer: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212121',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  filterButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 14,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeFilters: {
    flexDirection: 'row',
    flex: 1,
    gap: 8,
  },
  activeFilterChip: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeFilterText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearFiltersText: {
    fontSize: 12,
    color: '#f44336',
    fontWeight: '500',
  },
  clearFiltersButtonText: {
    fontSize: 14,
    color: '#2196f3',
    fontWeight: '500',
  },
  resultsContainer: {
    marginBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  expiredItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  expiringSoonItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  categoryTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  itemDescription: {
    fontSize: 14,
    color: '#757575',
    flex: 1,
    marginRight: 8,
  },
  daysContainer: {
    alignItems: 'flex-end',
  },
  daysText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4caf50',
  },
  expiringSoonText: {
    color: '#ff9800',
  },
  expiredText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f44336',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9e9e9e',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
  },
});

export default ItemList;

