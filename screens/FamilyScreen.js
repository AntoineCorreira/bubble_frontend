import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../reducers/user";
// import du composant picker integrer a react-native pour la liste déroulante
import { Picker } from "@react-native-picker/picker";
//import pour l icone faCircleXmark
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'

export default function FamilyScreen({navigation}) {
  const [nameChild, setNameChild] = useState("");
  const [firstnameChild, setFirstnameChild] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [countChild, setCountChild] = useState(0)
  // console.log(countChild)
  // selecteur de type de creche
  const [selectedValue, setSelectedValue] = useState("");
  // toujours l utilisation de useSelector() pour s'identifié avec le token
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  // creation de la fonction pour l ajout des données de l enfant grace a la route  POST/addChild
  const handleSubmit = () => {
    fetch("http://192.168.1.154:3000/users/addChild", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        namechild: nameChild,
        firstnamechild: firstnameChild,
        birthdate: birthDate,
        type: selectedValue,
        token: user.token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
          navigation.navigate('TabNavigator', { screen: 'Search' });
          dispatch(
            login({
              email: data.donnee.email,
              name: data.donnee.name,
              firstname: data.donnee.firstname,
              civility: data.donnee.civility,
              address: data.donnee.address,
              city: data.donnee.city,
              zip: data.donnee.zip,
              phone: data.donnee.phone,
              type: data.donnee.type,
              children: data.donnee.children,
            })
          );
      });
  };
 // creation d une function pour compté les nombres d enfants pour affichage
 const count = () =>{
  // console.log("click")
   setCountChild(countChild + 1)
 }
  return (
    <ImageBackground
      style={styles.imageBackground}
      source={require("../assets/background.png")}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.title}>BUBBLE</Text>
        <View style={styles.header}>
          <Text style={styles.text1}>Ma famille</Text>
          <Text style={styles.text2}>Ajouter mes enfants :</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(value) => setNameChild(value)}
            value={nameChild}
            placeholder="Nom"
            placeholderTextColor="#999999"
          />
          <TextInput
            style={styles.input}
            onChangeText={(value) => setFirstnameChild(value)}
            value={firstnameChild}
            placeholder="Prénom"
            placeholderTextColor="#999999"
          />
          <TextInput
            style={styles.input}
            onChangeText={(value) => setBirthDate(value)}
            value={birthDate}
            placeholder="Date de naissance"
            placeholderTextColor="#999999"
          />
        </View>
        <TouchableOpacity
          onPress={() => handleSubmit()}
          style={styles.joinDocBtn}
          activeOpacity={0.8}
        > 
          <Text style={styles.textButton}>Joindre des documents</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconContainer} onPress={count}>
        <FontAwesomeIcon icon={faUserPlus} style={styles.icon} size={25} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.text2}>Quelle type de garde priorisez-vous?</Text>
        <View style={styles.container}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue) => setSelectedValue(itemValue)}
              style={styles.picker}
            >
              <Picker.Item
                style={styles.size}
                label="Faite votre choix"
                value=""
              />
              <Picker.Item style={styles.size} label="Crèche" value="Crèche" />
              <Picker.Item
                style={styles.size}
                label="Garderie"
                value="Garderie"
              />
              <Picker.Item
                style={styles.size}
                label="Assistante Maternelle"
                value="Assistante Maternelle"
              />
              <Picker.Item style={styles.size} label="MAM" value="MAM" />
            </Picker>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleSubmit()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Sauvegarder</Text>
        </TouchableOpacity>
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
    marginTop: 30,
  },
  text2: {
    fontSize: 18,
    color: "white",
    marginTop: 20,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    justifyContent: "center",
    alignItems: "center",
    width: 347,
    height: 40,
    paddingRight: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: 10,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 347,
    height: 40,
    paddingRight: 30,
    backgroundColor: "#98B9F2",
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  textButton: {
    marginLeft: 20,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  joinDocBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: 220,
    height: 30,
    paddingRight: 30,
    backgroundColor: "#98B9F2",
    borderRadius: 50,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  picker: {
    width: 347,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    overflow: "hidden",
  },
  pickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 347,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 10, // Double du height pour une forme arrondie
    overflow: "hidden", // Important pour appliquer le borderRadius
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#999999",
  },
  size: {
    fontSize: 15,
    color: "#999999",
  },
   iconContainer:{
    marginTop: 10
   }
});
