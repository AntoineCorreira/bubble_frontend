import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const LocationScreen = () => {
    const [viewMode, setViewMode] = useState('list'); // État pour basculer entre liste et carte

    const establishmentsData = [
        {
        "name": "L'Îlot Enchanté",
        "latitude": 44.836,
        "longitude": -0.574,
        "image": "https://via.placeholder.com/150",
        "description": "Un lieu magique pour les enfants en plein coeur de Bordeaux."
        },
        {
        "name": "Les Petits Rêves",
        "latitude": 45.077,
        "longitude": -0.345,
        "image": "https://via.placeholder.com/150",
        "description": "Une maison chaleureuse pour vos petits rêves à Cavignac."
        },
        {
        "name": "Aux Petits Soins",
        "latitude": 48.857,
        "longitude": 2.352,
        "image": "https://via.placeholder.com/150",
        "description": "Assistante maternelle au coeur de Paris avec une approche bienveillante."
        },
        {
        "name": "Les Bambins Joyeux",
        "latitude": 44.841,
        "longitude": -0.580,
        "image": "https://via.placeholder.com/150",
        "description": "Une crèche moderne et ludique pour les enfants."
        },
        {
        "name": "Les Lutins de Paris",
        "latitude": 48.856,
        "longitude": 2.354,
        "image": "https://via.placeholder.com/150",
        "description": "Maison d'assistantes maternelles au coeur de Paris."
        },
        {
        "name": "Le Nid Douillet",
        "latitude": 45.080,
        "longitude": -0.346,
        "image": "https://via.placeholder.com/150",
        "description": "Un environnement paisible pour vos enfants à Cavignac."
        },
        {
        "name": "Le Petit Royaume",
        "latitude": 48.858,
        "longitude": 2.355,
        "image": "https://via.placeholder.com/150",
        "description": "Une crèche royale pour vos petits princes et princesses."
        }
    ]

    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={styles.background}
        >
            <Text style={styles.title}>BUBBLE</Text>
            <View style={styles.content}>
                <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.input} 
                            placeholder='Location        .        Période        .        Type' 
                            placeholderTextColor='#999999'
                        />
                        <FontAwesome name='search' size={20} color='#999999' style={styles.icon}/>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity 
                        style={[ // Bouton pour afficher la liste des établissements
                            styles.buttonList, 
                            viewMode === 'list' ? styles.activeButton : styles.inactiveButton
                        ]} 
                        onPress={() => setViewMode('list')}
                    >
                        <Text style={viewMode === 'list' ? styles.buttonTextActive : styles.buttonTextInactive}>Liste</Text>
                    </TouchableOpacity> 
                    <TouchableOpacity 
                        style={[ // Bouton pour afficher la carte
                            styles.buttonMap, 
                            viewMode === 'map' ? styles.activeButton : styles.inactiveButton
                        ]} 
                        onPress={() => setViewMode('map')}
                    >
                        <Text style={viewMode === 'map' ? styles.buttonTextActive : styles.buttonTextInactive}>Carte</Text>
                    </TouchableOpacity> 
                </View>
                {/* Render conditionnel de ScrollView ou Map */}
                {viewMode === 'list' ? (
                    <ScrollView contentContainerStyle={styles.establishmentContainer}>
                        {establishmentsData.map((item, index) => (
                            <View key={index} style={styles.establishmentItem}>
                                <Image source={{ uri: item.image }} style={styles.establishmentImage} />
                                <View style={styles.description}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemDescription}>{item.description}</Text>
                                </View>
                                <FontAwesome name="plus-circle" size={30} color="#98B9F2" />
                            </View>
                        ))}
                    </ScrollView>
                ) : (
                    <View style={styles.mapContainer}>
                        {/* Composant Map */}
                        <Text style={styles.mapText}>Here would be a map component!</Text>
                    </View>
                )}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Lily Script One',
        fontSize: 36,
        color: '#FFFFFF',
        marginTop: 30,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: 347,
        height: 51,
        paddingHorizontal: 10,
        position: 'relative',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 347,
        marginVertical: 10,
    },
    buttonList: {
        backgroundColor: '#FFFFFF',
        width: 170,
        height: 25,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonMap: {
        backgroundColor: '#98B9F2',
        width: 170,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFFFFF'
    },
    activeButton: {
        backgroundColor: '#FFFFFF',
        borderColor: '#98B9F2',
    },
    inactiveButton: {
        backgroundColor: '#98B9F2',
        borderColor: '#FFFFFF',
        borderWidth: 2,
    },
    buttonTextActive: {
        color: '#98B9F2',
    },
    buttonTextInactive: {
        color: '#FFFFFF',
    },
    icon: {
        position: 'absolute',
        right: 10,
    },
    input: {
        flex: 1,
        height: 40,
        paddingRight: 30,
    },
    establishmentContainer: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    establishmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: '100%',
        marginVertical: 5,
        padding: 10,
        width: 347,
        height: 85,
    },
    establishmentImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 10,
    },
    description: {
        flex: 1,
        marginHorizontal: 10,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemDescription: {
        fontSize: 12,
        color: '#555',
    },
    mapContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
        backgroundColor: '#fff',
        borderRadius: 10,
        width: 347,
    },
    mapText: {
        fontSize: 18,
        color: '#555',
    }
});

export default LocationScreen;