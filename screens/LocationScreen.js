import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { View, Text, StyleSheet, ImageBackground, TextInput, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

//Commentaires
// Fonction pour calculer la distance entre deux points GPS
// Utilise la formule de Haversine pour déterminer la distance entre deux coordonnées
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon moyen de la Terre en km
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Conversion de la latitude en radians
    const dLon = (lon2 - lon1) * (Math.PI / 180); // Conversion de la longitude en radians
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance en km
}

const LocationScreen = ({ navigation }) => {
    const [viewMode, setViewMode] = useState('list'); // État pour basculer entre vue liste et vue carte
    const [location, setLocation] = useState(null); // État pour stocker les coordonnées GPS de l'utilisateur
    const [selectedEstablishment, setSelectedEstablishment] = useState(null); // État pour stocker l'établissement sélectionné sur la carte
    const [establishmentsData, setEstablishmentsData] = useState([]); // État pour stocker la liste des établissements récupérés depuis la BDD

    // Effect pour demander les permissions de localisation et récupérer les coordonnées de l'utilisateur à l'initialisation du composant
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                // Si les permissions sont accordées, récupérer les coordonnées GPS actuelles
                const locationData = await Location.getCurrentPositionAsync({});
                setLocation(locationData.coords);  // Met à jour location avec coords
                console.log('Location:', locationData.coords);  // Vérifier les coordonnées
            } else {
                // Gérer le cas où l'utilisateur refuse les permissions
                console.warn('Location permissions not granted');
            }
        })();
    }, []);

    // Effect pour récupérer la liste des établissements depuis la BDD à l'initialisation du composant
    useEffect(() => {
        Font.loadAsync({
            'Lily Script One': require('../assets/fonts/LilyScriptOne-Regular.ttf'),
        });

        fetch('http://192.168.1.154:3000/establishments')
        .then(response => response.json())
        .then(data => {
            // Stocker les établissements dans l'état `establishmentsData`
            setEstablishmentsData(data.establishments);
            })
    }, [])

    // Préparer la liste des établissements avec leurs distances depuis la position actuelle
    const establishmentList = location
     ? establishmentsData
         .map((establishment, i) => {
            // Calculer la distance entre l'utilisateur et chaque établissement
             const distance = calculateDistance(
                 location.latitude,
                 location.longitude,
                 establishment.latitude,
                 establishment.longitude
             );
             return {...establishment, distance, i}; // Ajouter la distance et l'index aux données
         })
         .sort((a, b) => a.distance - b.distance) // Trier par distance croissante
         .map((establishment, i) => (
             <View key={i} style={styles.establishmentItem}>
                 <Image
                     source={{ uri: establishment.image }}
                     style={styles.establishmentImage}
                 />
                 <View style={styles.description}>
                     <View style={styles.nameAndDistance}>
                         <Text style={styles.itemName}>{establishment.name}</Text>
                         <Text style={styles.distanceText}>
                             {establishment.distance.toFixed(2)} km
                         </Text>
                     </View>
                     <Text style={styles.itemDescription}>
                         {establishment.description}
                     </Text>
                 </View>
                 <FontAwesome name="plus-circle" size={30} color="#98B9F2" />
             </View>
         ))
     : null;  // Ne pas afficher la liste si location est null

    // Préparer les marqueurs pour chaque établissement sur la carte
    const mapMarkers = location
     ? establishmentsData.map((establishment, index) => {
         const distance = calculateDistance(
             location.latitude,
             location.longitude,
             establishment.latitude,
             establishment.longitude
         );
         return (
             <Marker
                 key={index}
                 coordinate={{
                     latitude: establishment.latitude,
                     longitude: establishment.longitude,
                 }}
                 title={establishment.name}
                 description={`Distance: ${distance.toFixed(2)} km`}
                 onPress={() => {
                     setSelectedEstablishment(establishment);
                 }}
             />
         );
     })
     : null;

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
                        placeholder="Location        .        Période        .        Type"
                        placeholderTextColor="#999999"
                        onPress={() => {navigation.navigate('Filter')}}
                    />
                    <FontAwesome name="search" size={20} color="#999999" style={styles.icon} />
                </View>
               
                <View style={styles.button}>
                    <TouchableOpacity
                        style={[styles.buttonList, viewMode === 'list' ? styles.activeButton : styles.inactiveButton]}
                        onPress={() => setViewMode('list')}
                    >
                        <Text style={viewMode === 'list' ? styles.buttonTextActive : styles.buttonTextInactive}>
                            Liste
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.buttonMap, viewMode === 'map' ? styles.activeButton : styles.inactiveButton]}
                        onPress={() => setViewMode('map')}
                    >
                        <Text style={viewMode === 'map' ? styles.buttonTextActive : styles.buttonTextInactive}>
                            Carte
                        </Text>
                    </TouchableOpacity>
                </View>

                
                {viewMode === 'list' ? (
                    <ScrollView contentContainerStyle={styles.establishmentContainer}>
                        {establishmentList} 
                    </ScrollView>
                ) : (
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            region={location ? {
                                latitude: location.latitude,
                                longitude: location.longitude,
                                latitudeDelta: 0.1,
                                longitudeDelta: 0.1,
                            } : { latitude: 46.603354, longitude: 1.888334, latitudeDelta: 10, longitudeDelta: 10 }}
                        >
                            
                        </MapView>
                        
                        {selectedEstablishment && (
                            <View style={styles.selectedEstablishment}>
                                <Image
                                    source={{ uri: selectedEstablishment.image }}
                                    style={styles.establishmentImage}
                                />
                                <View style={styles.description}>
                                    <Text style={styles.itemName}>
                                        {selectedEstablishment.name}
                                    </Text>
                                    <Text style={styles.itemDescription}>
                                        {selectedEstablishment.description}
                                    </Text>
                                </View>
                                <FontAwesome name="plus-circle" size={30} color="#98B9F2" />
                            </View>
                        )}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonList: {
        backgroundColor: '#FFFFFF',
        width: 165,
        height: 25,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    buttonMap: {
        backgroundColor: '#98B9F2',
        width: 165,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        marginHorizontal: 5,
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
    input: {
        flex: 1,
        height: 40,
        paddingRight: 30, // Ajustez ceci pour s'assurer qu'il y a de l'espace pour les deux icônes
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
    nameAndDistance: {
        flexDirection: 'row',
        width: 220,
        justifyContent: 'space-between',
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
        height: 400, 
        width: 347, 
        borderRadius: 10,
        marginVertical: 50,
    },
    mapText: {
        fontSize: 18,
        color: '#555',
    },
    map:  {
        width: '100%',
        height: '100%',
    },
    selectedEstablishment: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        width: '100%',
    },
});

export default LocationScreen;
