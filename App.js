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
import establishment from './reducers/establishment'; // Importer searchCriteria

import LoginScreen from './screens/LoginScreen';
import CoordonneeScreen from './screens/CoordonneeScreen';
import FamilyScreen from './screens/FamilyScreen';
import LocationScreen from './screens/LocationScreen';
import FilterScreen from './screens/FilterScreen';
import EstablishmentScreen from './screens/EstablishmentScreen';
import MessageScreen from './screens/MessageScreen';
import ProfilScreen from './screens/ProfilScreen';
import ReservationScreen from './screens/ReservationScreen';

const store = configureStore({
  reducer: { 
    user,
    searchCriteria,
    establishment, // Ajouter le réducteur ici
  },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
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

          return (
            <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
              {/* Rectangle semi-transparent */}
              {focused && (
                <View
                  style={{
                    position: 'absolute',
                    width: size + 60, // Ajustez la largeur par rapport à la taille de l'icône (size)
                    height: size + 20, // Ajustez la hauteur
                    borderRadius: 10,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Couleur semi-transparente
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              )}
              {/* Icône */}
              <FontAwesome name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarLabel: () => null,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#EABBFF',
          elevation: 0,
          borderTopWidth: 0,
        },
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
          <Stack.Screen name="Info" component={CoordonneeScreen} />
          <Stack.Screen name="Filter" component={FilterScreen} />
          <Stack.Screen name="Establishment" component={EstablishmentScreen} />
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
