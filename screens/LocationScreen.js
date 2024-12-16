import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { choosedEstablishment } from '../reducers/establishment';
import * as Font from 'expo-font';
import { View, Text, StyleSheet, ImageBackground, TextInput, Image, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Fonction pour calculer la distance entre deux points GPS
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const LocationScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const [viewMode, setViewMode] = useState('list');
    const [location, setLocation] = useState(null);
    const [selectedEstablishment, setSelectedEstablishment] = useState(null);
    const [establishmentsData, setEstablishmentsData] = useState([]);
    const [locationPermission, setLocationPermission] = useState(false);
    const searchCriteria = useSelector(state => state.searchCriteria);

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'Lily Script One': require('../assets/fonts/LilyScriptOne-Regular.ttf'),
            });
        };
        loadFonts();
    }, []);

    useEffect(() => {
        const requestLocationPermission = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const locationData = await Location.getCurrentPositionAsync({});
                setLocation(locationData.coords);
                setLocationPermission(true);
            } else {
                console.warn('Location permissions not granted');
                setLocationPermission(false);
            }
        };
        requestLocationPermission();
    }, []);

    useEffect(() => {
        const criteria = route.params?.searchCriteria || searchCriteria;
        // console.log('Critères de recherche reçus:', criteria);

        const queryParts = [];
        if (criteria.city) {
            queryParts.push(`city=${encodeURIComponent(criteria.city)}`);
        }
        if (criteria.day && criteria.day.length > 0) {
            queryParts.push(`day=${encodeURIComponent(criteria.day.join(','))}`);
        }
        if (criteria.type) {
            queryParts.push(`type=${encodeURIComponent(criteria.type)}`);
        }
        const query = queryParts.join('&');
        // console.log('Requête URL construite:', query);

        fetch(`http://192.168.1.154:3000/establishments?${query}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // console.log('Réponse de l\'API:', data);
                // console.log('Type de data:', typeof data);
                if (Array.isArray(data.establishments)) {
                    // console.log('Établissements trouvés:', data.establishments.length);
                    if (data.establishments.length === 0) {
                        Alert.alert("Aucun établissement", "Aucun établissement n'est ouvert aux dates sélectionnées.");
                    } else {
                        setEstablishmentsData(data.establishments);
                    }
                } else {
                    // console.error('Format de données inattendu:', data);
                    Alert.alert("Erreur", "Format de données inattendu.");
                }
            })
            .catch(error => {
                console.error('Error fetching establishments:', error);
            });
    }, [route.params?.searchCriteria, searchCriteria]);

    const addEstablishmentToStore = (newEstablishment) => {
        dispatch(choosedEstablishment({
            name: newEstablishment.name,
            description: newEstablishment.description,
            type: newEstablishment.type,
            address: newEstablishment.address,
            city: newEstablishment.city,
            zip: newEstablishment.zip,
            phone: newEstablishment.phone,
            mail: newEstablishment.mail,
            image: newEstablishment.image,
            gallery: newEstablishment.gallery,
            schedules: newEstablishment.schedules,
            capacity: newEstablishment.capacity,
        }));
        navigation.navigate('Establishment');
    };

    const isValidLocation = (latitude, longitude) => {
        return latitude && longitude && !isNaN(latitude) && !isNaN(longitude);
    };

    // Préparer la liste des établissements avec leurs distances depuis la position actuelle
    const establishmentList = location
        ? establishmentsData
            .filter(establishment =>
                (!searchCriteria.city || establishment.city.toLowerCase() === searchCriteria.city.toLowerCase()) &&
                (!searchCriteria.day || establishment.schedules.some(schedule => searchCriteria.day.includes(schedule.day)))
            )
            .map((establishment, i) => {
                const distance = isValidLocation(establishment.latitude, establishment.longitude)
                    ? calculateDistance(
                        location.latitude,
                        location.longitude,
                        establishment.latitude,
                        establishment.longitude
                    ) : 0;
                return { ...establishment, distance, i }; // Ajouter la distance et l'index aux données
            })
            .sort((a, b) => a.distance - b.distance) // Trier par distance croissante
            .map((establishment, i) => (
                <View key={i} style={styles.establishmentItem}>
                    <Image source={{ uri: establishment.image }} style={styles.establishmentImage} />
                    <View style={styles.description}>
                        <View style={styles.nameAndDistance}>
                            <Text style={styles.itemName}>
                                {establishment.name.length > 50
                                    ? establishment.name.slice(0, 50) + '...'
                                    : establishment.name}
                            </Text>
                            <Text style={styles.distanceText}>
                                {establishment.distance.toFixed(2)} km
                            </Text>
                        </View>
                        <Text style={styles.itemDescription}>
                            {establishment.description.length > 60
                                ? establishment.description.slice(0, 60) + '...'
                                : establishment.description}
                        </Text>
                    </View>
                    <FontAwesome name="plus-circle" size={30} color="#98B9F2" onPress={() => { addEstablishmentToStore(establishment) }} />
                </View>
            ))
        : null; // Ne pas afficher la liste si location est null

    const mapMarkers = location
        ? establishmentsData.map((establishment, index) => {
            const distance = isValidLocation(establishment.latitude, establishment.longitude)
                ? calculateDistance(
                    location.latitude,
                    location.longitude,
                    establishment.latitude,
                    establishment.longitude
                )
                : 0;

            // Créer une clé unique pour chaque marqueur
            const markerKey = establishment.id
                ? establishment.id.toString()
                : `marker-fallback-key-${index}`;

            return (
                <Marker
                    key={markerKey}
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
        <ImageBackground source={require('../assets/background.png')} style={styles.background}>
            <Text style={styles.title}>BUBBLE</Text>
            <View style={styles.content}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="City . Period . Type"
                        placeholderTextColor="#999999"
                        onFocus={() => navigation.navigate('Filter')}
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
                        {/* <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreEstablishments}>
                            <Text style={styles.loadMoreText}>Voir plus</Text>
                        </TouchableOpacity> */}
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
                            {mapMarkers}
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
                                <FontAwesome name="plus-circle" size={30} color="#98B9F2" onPress={() => { addEstablishmentToStore(selectedEstablishment) }} />
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
        width: 140,
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
        marginVertical: 20,
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
    loadMoreButton: {
        backgroundColor: '#EABBFF',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#FFFFFF"
    },
    loadMoreText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
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
        width: 225,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemName: {
        fontSize: 16,
        width: 160,
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
    map: {
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