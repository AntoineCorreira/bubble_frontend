import { View, Text, StyleSheet, ImageBackground, TextInput, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';

const serveurIP = process.env.EXPO_PUBLIC_SERVEUR_IP;

export default function EstablishmentScreen({ navigation }) {
    const user = useSelector((state) => state.user.value)
    console.log('Reducer :', user);
    // const criteria = useSelector((state) => state.searchCriteria.value)
    const establishment = useSelector((state) => state.establishment.value)

    const criteria = {
        city: 'Paris',
        startDate: '02/01/2025',
        endDate: '03/01/2025',
        childName: 'Alexandre'
    }

    // const user = {
    //     firstname: 'Antoine',
    //     name: 'Correira',
    // }

    const reservationData = {
        startDate: criteria.startDate,
        endDate: criteria.endDate,
        parentFirstname: user.firstname,
        parentName: user.name,
        child: criteria.childName,
        establishmentName: establishment.name,
        establishmentZip: establishment.zip,
        status: 'pending',
    }

    makeRequest = async () => {
        try {
            const response = await fetch(`http://${serveurIP}:3000/reservations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservationData),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }
        navigation.navigate('Validation');
    };

    const images = {
        1: require(`../assets/etablissements/image1.png`),
        2: require(`../assets/etablissements/image2.png`),
        3: require(`../assets/etablissements/image3.png`),
        4: require(`../assets/etablissements/image4.png`),
        5: require(`../assets/etablissements/image5.png`),
        6: require(`../assets/etablissements/image6.png`),
        7: require(`../assets/etablissements/image7.png`),
        8: require(`../assets/etablissements/image8.png`),
        9: require(`../assets/etablissements/image9.png`),
        10: require(`../assets/etablissements/image10.png`),
        11: require(`../assets/etablissements/image11.png`),
        12: require(`../assets/etablissements/image12.png`),
        13: require(`../assets/etablissements/image13.png`),
        14: require(`../assets/etablissements/image14.png`),
    }

    const gallery = establishment.gallery.map((image, i) => {
        const randomNumber = Math.floor(Math.random() * 14) + 1; // génère un nombre entre 1 et 14
        return (
            <Image key={i} source={images[randomNumber]} style={styles.images} />
        )
    })

    const schedules = establishment.schedules.map((schedule, i) => {
        return (
            <Text style={styles.scheduleText} key={i}>{schedule.day} : {schedule.startTime} - {schedule.endTime}</Text>
        )
    })

    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={styles.background}
        >
            <FontAwesome5 style={styles.return} name="chevron-left" size={30} color="#FFFFFF" onPress={() => { navigation.navigate('Search') }} />
            <Text style={styles.title}>BUBBLE</Text>
            <View style={styles.content}>
                <ScrollView horizontal={true} contentContainerStyle={styles.gallery}>
                    {gallery}
                </ScrollView>
                <ScrollView
                    contentContainerStyle={[styles.informations, { flexGrow: 1, paddingHorizontal: 20 }]}
                    nestedScrollEnabled={true}
                >
                    <View style={styles.typeContainer}>
                        <FontAwesome5 style={styles.iconType} name="igloo" size={30} color="#FFFFFF" />
                        <Text style={styles.textType}>{establishment.name}</Text>
                    </View>
                    <Text style={styles.descriptionContainer}>{establishment.description}</Text>
                    <View style={styles.locationContainer}>
                        <FontAwesome5 style={styles.iconType} name="map-marker-alt" size={30} color="#FFFFFF" />
                        <Text style={styles.textLocation}>
                            {establishment.address}, {establishment.zip} {establishment.city}
                        </Text>
                    </View>
                    <View style={styles.schedulesContainer}>
                        <FontAwesome5 style={styles.iconType} name="clock" size={30} color="#FFFFFF" />
                        <View style={styles.schedules}>{schedules}</View>
                    </View>
                    <View style={styles.capacityContainer}>
                        <FontAwesome5 style={styles.iconType} name="baby-carriage" size={30} color="#FFFFFF" />
                        <Text style={styles.textType}>
                            Capacité de {establishment.capacity} enfants maximum
                        </Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonContact} onPress={() => navigation.navigate('Contact')}>
                            <Text style={styles.buttonContactText}>Contacter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonRequest} onPress={makeRequest}>
                            <Text style={styles.buttonRequestText}>Faire une demande</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
    return: {
        position: 'absolute',
        top: 40,
        left: 20,
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
    gallery: {
        flexDirection: 'row',
        padding: 10,
        // backgroundColor: 'blue',
        height: 400,
    },
    images: {
        width: Dimensions.get('window').width * 0.8, // Adjust the image size based on screen width
        height: Dimensions.get('window').height * 0.3, // Adjust the image size based on screen width
        margin: 5,
    },
    informations: {
        flexGrow: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    typeContainer: {
        flexDirection: 'row',
        justifyContent: 'left',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 10,
    },
    textLocation: {
        color: '#FFFFFF',
        marginHorizontal: 20,
        fontWeight: 600,
        fontSize: 22,
    },
    textType: {
        color: "#FFFFFF",
        marginHorizontal: 11,
        fontWeight: 600,
        fontSize: 22,
        marginRight: 20,
    },
    descriptionContainer: {
        color: "#FFFFFF",
        marginLeft: 55,
        marginRight: 20,
        marginTop: 10,
        fontWeight: 400,
        fontSize: 22,
    },
    locationContainer: {
        flexDirection: 'row',
        justifyContent: 'left',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 30
    },
    schedulesContainer: {
        flexDirection: 'row',
        justifyContent: 'left',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 30,
    },
    schedules: {
        flexDirection: 'column',
        marginHorizontal: 13,
    },
    scheduleText: {
        color: '#FFFFFF',
        fontWeight: 400,
        fontSize: 20,
    },
    capacityContainer: {
        flexDirection: 'row',
        justifyContent: 'left',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 30,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 50,
        width: '100%',
        // backgroundColor: 'white',
    },
    buttonContact: {
        // borderWidth: 2,
        // borderRadius: 10,
        // borderColor: '#FFFFFF',
        marginHorizontal: 10,
        padding: 10,
        width: 121,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContactText: {
        fontSize: 20,
        fontWeight: '600',
        textDecorationLine: 'underline',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    buttonRequest: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#FFFFFF',
        marginHorizontal: 10,
        padding: 10,
        width: 121, // Largeur égale pour chaque bouton
        alignItems: 'center',
    },
    buttonRequestText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
})