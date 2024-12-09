import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
// import { Navigation } from '@react-navigation/native';
import React from 'react'

export default function LoginScreen({ navigation }) {

    const handleSubmit = () => {
        navigation.navigate('TabNavigator', { screen: 'Search' });
    }

    return (
        <View>
        <Text>LoginScreen</Text>
            <TouchableOpacity onPress={() => handleSubmit()} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.textButton}>Go to Search</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({})