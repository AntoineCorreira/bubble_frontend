import { View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from './reducers/user';
import searchCriteria from './reducers/searchCriteria';
import establishment from './reducers/establishment';
import LoginScreen from './screens/LoginScreen';
import CoordonneeScreen from './screens/CoordonneeScreen';
import FamilyScreen from './screens/FamilyScreen';
import LocationScreen from './screens/LocationScreen';
import FilterScreen from './screens/FilterScreen';
import EstablishmentScreen from './screens/EstablishmentScreen';
import ContactScreen from './screens/ContactScreen';
import ValidationScreen from './screens/ValidationScreen';
import ProfilScreen from './screens/ProfilScreen';
import ReservationScreen from './screens/ReservationScreen';
import ObligatoryFilterScreen from './screens/ObligatoryFilterScreen'; 

const store = configureStore({
  reducer: { 
    user,
    searchCriteria,
    establishment,
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
                    height: size + 20, // Ajuste la hauteur
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
          <Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen name="Info" component={CoordonneeScreen} />
          <Stack.Screen name="Enfant" component={FamilyScreen} />
          <Stack.Screen name="Filter" component={FilterScreen} />
          <Stack.Screen name="ObligatoryFilter" component={ObligatoryFilterScreen} />
          <Stack.Screen name="Establishment" component={EstablishmentScreen}/>
          <Stack.Screen name="Validation" component={ValidationScreen}/>
          <Stack.Screen name="Contact" component={ContactScreen}/>
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
