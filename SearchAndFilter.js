import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { useItems } from '../context/ItemContext';

const SearchAndFilter = ({ visible, onClose }) => {
  const { 
    searchQuery, 
    selectedCategory, 
    searchItems, 
    filterByCategory, 
    getCategories, 
    clearFilters 
  } = useItems();
  
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const categories = getCategories();

  const handleSearch = (query) => {
    setLocalSearchQuery(query);
    searchItems(query);
  };

  const handleCategoryFilter = (category) => {
    filterByCategory(category === selectedCategory ? null : category);
  };

  const handleClearFilters = () => {
    setLocalSearchQuery('');
    clearFilters();
  };

  const hasActiveFilters = searchQuery || selectedCategory;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Search & Filter</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Search Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Items</Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                value={localSearchQuery}
                onChangeText={handleSearch}
                placeholder="Search by item name..."
                placeholderTextColor="#9e9e9e"
                clearButtonMode="while-editing"
              />
            </View>
          </View>

          {/* Category Filter Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Filter by Category</Text>
            {categories.length > 0 ? (
              <View style={styles.categoryContainer}>
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.categoryChip,
                      selectedCategory === category && styles.selectedCategoryChip
                    ]}
                    onPress={() => handleCategoryFilter(category)}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      selectedCategory === category && styles.selectedCategoryChipText
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No categories available</Text>
            )}
          </View>

          {/* Active Filters Section */}
          {hasActiveFilters && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Active Filters</Text>
              <View style={styles.activeFiltersContainer}>
                {searchQuery && (
                  <View style={styles.activeFilter}>
                    <Text style={styles.activeFilterText}>
                      Search: "{searchQuery}"
                    </Text>
                  </View>
                )}
                {selectedCategory && (
                  <View style={styles.activeFilter}>
                    <Text style={styles.activeFilterText}>
                      Category: {selectedCategory}
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearFilters}
              >
                <Text style={styles.clearButtonText}>Clear All Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  searchContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    padding: 16,
    fontSize: 16,
    color: '#212121',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryChip: {
    backgroundColor: '#2196f3',
    borderColor: '#2196f3',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  selectedCategoryChipText: {
    color: '#ffffff',
  },
  emptyText: {
    fontSize: 14,
    color: '#9e9e9e',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  activeFiltersContainer: {
    gap: 8,
    marginBottom: 16,
  },
  activeFilter: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  activeFilterText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default SearchAndFilter;

