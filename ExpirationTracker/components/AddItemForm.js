import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useItems } from '../context/ItemContext';

const AddItemForm = ({ navigation }) => {
  const { addItem, getCategories } = useItems();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: new Date(),
    expirationDays: '',
    category: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = getCategories();
  const predefinedCategories = [
    'Hygiene',
    'Cleaning',
    'Food',
    'Medicine',
    'Beauty',
    'Kitchen',
    'General',
  ];

  const allCategories = [...new Set([...predefinedCategories, ...categories])];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      handleInputChange('startDate', selectedDate);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Item name is required');
      return false;
    }
    if (!formData.expirationDays || isNaN(formData.expirationDays) || parseInt(formData.expirationDays) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid number of days');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const itemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        startDate: formData.startDate,
        expirationDays: parseInt(formData.expirationDays),
        category: formData.category.trim() || 'General',
      };

      await addItem(itemData);
      Alert.alert('Success', 'Item added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Item Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="e.g., Toothbrush, Kitchen Sponge"
            placeholderTextColor="#9e9e9e"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Optional description"
            placeholderTextColor="#9e9e9e"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Start Date</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(formData.startDate)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.startDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expiration/Replacement Days *</Text>
          <TextInput
            style={styles.input}
            value={formData.expirationDays}
            onChangeText={(value) => handleInputChange('expirationDays', value)}
            placeholder="e.g., 90"
            placeholderTextColor="#9e9e9e"
            keyboardType="numeric"
          />
          <Text style={styles.helperText}>
            Number of days until this item should be replaced
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            value={formData.category}
            onChangeText={(value) => handleInputChange('category', value)}
            placeholder="e.g., Hygiene, Cleaning, Food"
            placeholderTextColor="#9e9e9e"
          />
          
          {allCategories.length > 0 && (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryLabel}>Suggested categories:</Text>
              <View style={styles.categoryTags}>
                {allCategories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.categoryTag,
                      formData.category === category && styles.selectedCategoryTag
                    ]}
                    onPress={() => handleInputChange('category', category)}
                  >
                    <Text style={[
                      styles.categoryTagText,
                      formData.category === category && styles.selectedCategoryTagText
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Adding...' : 'Save Item'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212121',
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 80,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
  },
  dateText: {
    fontSize: 16,
    color: '#212121',
  },
  helperText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  categoryContainer: {
    marginTop: 8,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  categoryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryTag: {
    backgroundColor: '#2196f3',
  },
  categoryTagText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  selectedCategoryTagText: {
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#9e9e9e',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default AddItemForm;

