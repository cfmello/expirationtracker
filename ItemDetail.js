import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useItems } from '../context/ItemContext';

const ItemDetail = ({ route, navigation }) => {
  const { itemId } = route.params;
  const { items, markAsReplaced, removeItem } = useItems();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const foundItem = items.find(i => i.id === itemId);
    setItem(foundItem);
  }, [itemId, items]);

  const handleMarkAsReplaced = () => {
    Alert.alert(
      'Mark as Replaced',
      'This will reset the start date to today. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Replace',
          onPress: async () => {
            try {
              await markAsReplaced(itemId);
              Alert.alert('Success', 'Item marked as replaced!');
            } catch (error) {
              Alert.alert('Error', 'Failed to mark item as replaced');
            }
          },
        },
      ]
    );
  };

  const handleRemoveItem = () => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeItem(itemId);
              Alert.alert('Success', 'Item removed successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to remove item');
            }
          },
        },
      ]
    );
  };

  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  const getDaysStatusColor = (remainingDays, isExpired) => {
    if (isExpired) return '#f44336';
    if (remainingDays <= 3) return '#ff9800';
    return '#4caf50';
  };

  if (!item) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Item not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.category && (
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        )}
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.daysContainer}>
          <Text style={[
            styles.daysNumber,
            { color: getDaysStatusColor(item.remainingDays, item.isExpired) }
          ]}>
            {item.isExpired ? 'EXPIRED' : item.remainingDays}
          </Text>
          {!item.isExpired && (
            <Text style={styles.daysLabel}>
              {item.remainingDays === 1 ? 'day remaining' : 'days remaining'}
            </Text>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Description:</Text>
            <Text style={styles.infoValue}>
              {item.description || 'No description provided'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Start Date:</Text>
            <Text style={styles.infoValue}>{formatDate(item.startDate)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Expiration Date:</Text>
            <Text style={styles.infoValue}>{formatDate(item.expirationDate)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Replacement Cycle:</Text>
            <Text style={styles.infoValue}>
              Every {item.expirationDays} {item.expirationDays === 1 ? 'day' : 'days'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created:</Text>
            <Text style={styles.infoValue}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.replaceButton]}
          onPress={handleMarkAsReplaced}
        >
          <Text style={styles.actionButtonText}>Mark as Replaced</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={handleRemoveItem}
        >
          <Text style={styles.actionButtonText}>Remove Item</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    flex: 1,
  },
  categoryTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  categoryText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  daysContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 20,
  },
  daysNumber: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 4,
  },
  daysLabel: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '500',
  },
  infoSection: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#212121',
    flex: 2,
    textAlign: 'right',
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  replaceButton: {
    backgroundColor: '#4caf50',
  },
  removeButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
  },
});

export default ItemDetail;

