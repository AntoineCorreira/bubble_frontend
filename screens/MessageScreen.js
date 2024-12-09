import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Nom du Screen</Text>
        </View>
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

export default MessageScreen;