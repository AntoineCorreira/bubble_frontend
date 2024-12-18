import React from 'react';
import { Image, View, Text, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity} from 'react-native';
import { useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHourglassStart, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
const ReservationScreen = () => {

  const [reservations,setReservation] = useState([])

const User = useSelector((state)=>state.user.value)
  useEffect(()=>{
    fetch("http://192.168.1.53:3000/reservations/allReservations", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        _id : User._id
      }),
    })
    .then(response => response.json())
    .then(data=>{
      if(data.result){ setReservation(data.dataReservation)}
    })
  },[])

  let reservationView = ''
  if(reservations.length){
   reservationView = reservations.map((data, i)=>{
      return <View key={i} style={styles.reservationCard}>
                   <Image style={styles.image} source={{uri: data.establishment.image}} />
                 <View style={styles.infosContainer}>
                  <Text style={styles.titleCard}>{data.establishment.name}</Text>
                  <Text>Demande de reservation faite pour </Text>
                  <Text>{data.child}</Text>
                  <Text>du {data.startDate} au {data.endDate}</Text>
                 </View>
                 <View style={styles.validation}>
                    {data.status === 'accept' ? <FontAwesomeIcon icon={faThumbsUp} style={styles.icon} size={25} color="#AABBFF"/>: 
                    data.status === 'pending'? <FontAwesomeIcon icon={faHourglassStart} style={styles.icon} size={25} color="#AABBFF"/>:
                    <FontAwesomeIcon icon={faThumbsDown} style={styles.icon} size={25} color="#AABBFF"/>}
                 </View>
             </View>
    })
  }else{ reservationView = <Text style={styles.nothing} >Vous n'avez pas encore fait de demandes</Text>}
  
    return (
        <ImageBackground  style={styles.imageBackground}
        source={require("../assets/background.png")}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
             <Text style={styles.title} >BUBBLE</Text>
              <View style={styles.header}>
                <Text style={styles.text1}>Mes Demandes</Text>
              </View>
              <ScrollView  contentContainerStyle={styles.reservContainer}>
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
    alignItems: 'center',
    borderRadius: 10,
    height: 80,
    width: 80,
    margin: 5,
  },
  titleCard: {
    fontSize: 18,
  },
  notReservation: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  nothing: {
    marginTop: '230',
    color:'white',
    fontSize: 15
  }
});

export default ReservationScreen;