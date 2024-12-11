import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from './reducers/user';
import searchCriteria from './reducers/searchCriteria'; // Importer searchCriteria

import LoginScreen from './screens/LoginScreen';
import CoordonneeScreen from './screens/CoordonneeScreen';
import FamilyScreen from './screens/FamilyScreen';
import LocationScreen from './screens/LocationScreen';
import FilterScreen from './screens/FilterScreen';
import MessageScreen from './screens/MessageScreen';
import ProfilScreen from './screens/ProfilScreen';
import ReservationScreen from './screens/ReservationScreen';

const store = configureStore({
  reducer: { 
    user,
    searchCriteria, // Ajouter le réducteur ici
  },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Message') {
            iconName = 'envelope';
          } else if (route.name === 'Reservation') {
            iconName = 'check';
          } else if (route.name === 'Profil') {
            iconName = 'user';
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#335561',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Search" component={LocationScreen} />
      <Tab.Screen name="Message" component={MessageScreen} />
      <Tab.Screen name="Reservation" component={ReservationScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Filter" component={FilterScreen} />
          <Stack.Screen name="Info" component={CoordonneeScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
