import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

const ReservationScreen = () => {
    return (
        <ImageBackground
                    source={require('../assets/background.png')}
                    style={styles.background}
        >   
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F7FF',
},
screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
},

});

export default ReservationScreen;