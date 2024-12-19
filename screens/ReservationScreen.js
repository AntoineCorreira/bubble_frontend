import React from 'react';
import { Image, View, Text, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import { useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHourglassStart, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import { useIsFocused } from '@react-navigation/native'; // useIsFocused etat booleen utilisé pour raffraichir le screen a chaques fois qu on revient dessus.

const serveurIP = process.env.EXPO_PUBLIC_SERVEUR_IP;

const ReservationScreen = () => {

  const [reservations, setReservation] = useState([])
  const focused = useIsFocused()
  const User = useSelector((state) => state.user.value)
  console.log(User)
  useEffect(() => {
    fetch(`http://${serveurIP}:3000/reservations/allReservations`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        _id: User._id
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.result) { setReservation(data.dataReservation) }
      })
    //utilisation de la variable focused pour mettre a jour les demandes
  }, [focused])

  const randomNumber = () => {
    const number = Math.floor(Math.random() * 14) + 1; // génère un nombre entre 1 et 14
    return number
  }

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

  let reservationView = '';
  if (reservations.length) {
    reservationView = reservations.map((data, i) => {
      // Récupérer les prénoms et noms des enfants
      const childrenNames = data.child
        .map(childId => {
          const child = data.parent.children.find(c => c._id === childId);
          return child ? `${child.firstnamechild} ${child.namechild}` : 'Enfant inconnu';
        })
        .join(', '); // Combine les noms avec une virgule

      return (
        <View key={i} style={styles.reservationCard}>
          <Image style={styles.image} source={images[randomNumber()]} />
          <View style={styles.infosContainer}>
            <Text style={styles.titleCard}>{data.establishment.name}</Text>
            <Text style={styles.childNames}>{childrenNames}</Text>
            <Text style={styles.reservationDates}>du {data.startDate} au {data.endDate}</Text>
          </View>
          <View style={styles.validation}>
            {data.status === 'accept' ? (
              <FontAwesomeIcon icon={faThumbsUp} style={styles.icon} size={25} color="#AABBFF" />
            ) : data.status === 'pending' ? (
              <FontAwesomeIcon icon={faHourglassStart} style={styles.icon} size={25} color="#AABBFF" />
            ) : (
              <FontAwesomeIcon icon={faThumbsDown} style={styles.icon} size={25} color="#AABBFF" />
            )}
          </View>
        </View>
      );
    });
  } else {
    reservationView = <Text style={styles.nothing}>Vous n'avez pas encore fait de demandes</Text>;
  }

  return (
    <ImageBackground style={styles.imageBackground}
      source={require("../assets/background.png")}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Text style={styles.title} >BUBBLE</Text>
        <View style={styles.header}>
          <Text style={styles.text1}>Mes Demandes</Text>
        </View>
        <ScrollView contentContainerStyle={styles.reservContainer}>
          {reservationView}
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageBackground: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontFamily: 'Lily Script One',
    fontSize: 36,
    color: '#FFFFFF',
    marginTop: 30,
    width: 140,
  },
  text1: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
    marginTop: 50,
  },
  reservContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
  },
  reservationCard: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    height: 100,
    width: 350,
    marginTop: 15,
    padding: 2
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 10,
  },
  titleCard: {
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  childNames: {
    fontSize: 16,
    fontWeight: 400,
  },
  reservationDates: {
    fontSize: 16,
    fontWeight: 600,
  },
  notReservation: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  nothing: {
    marginTop: '230',
    color: 'white',
    fontSize: 15
  },
  infosContainer: {
    justifyContent: 'center',
  }
});

export default ReservationScreen;