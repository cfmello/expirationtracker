import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ItemProvider } from './context/ItemContext';
import ItemList from './components/ItemList';
import AddItemForm from './components/AddItemForm';
import ItemDetail from './components/ItemDetail';
import Settings from './components/Settings';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack Navigator
function HomeStack() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: theme.surface,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="ItemList"
        component={ItemList}
        options={({ navigation }) => ({
          title: 'Expiration Tracker',
          headerRight: () => (
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.secondary }]}
              onPress={() => navigation.navigate('AddItem')}
            >
              <Text style={[styles.addButtonText, { color: theme.surface }]}>+</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="AddItem"
        component={AddItemForm}
        options={{
          title: 'Add New Item',
        }}
      />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetail}
        options={{
          title: 'Item Details',
        }}
      />
    </Stack.Navigator>
  );
}

// Settings Stack Navigator
function SettingsStack() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: theme.surface,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="SettingsMain"
        component={Settings}
        options={{
          title: 'Settings',
        }}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function MainTabs() {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Items',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>📋</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// App Component with Theme
function AppContent() {
  const { theme, isLoading } = useTheme();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}

// Root App Component
const App = () => {
  return (
    <ThemeProvider>
      <ItemProvider>
        <AppContent />
      </ItemProvider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default App;
