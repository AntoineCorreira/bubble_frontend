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

const serveurIP = process.env.EXPO_PUBLIC_SERVEUR_IP;
console.log('Serveur IP:', serveurIP);

export default function FamilyScreen({ navigation }) {
  const [nameChild, setNameChild] = useState("");
  const [firstnameChild, setFirstnameChild] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // selecteur de type de creche
  const [selectedValue, setSelectedValue] = useState("");
  // toujours l utilisation de useSelector() pour s'identifié avec le token
  const user = useSelector((state) => state.user.value);
  console.log('FamilyScreen', user)
  const dispatch = useDispatch();
  // creation de la fonction pour l ajout des données de l enfant grace a la route  POST/addChild
  const handleSubmit = (change) => {
    fetch(`http://${serveurIP}:3000/users/addChild`, {
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
        console.log('familyScreen', data.donnee)
        change === false && navigation.navigate('TabNavigator', { screen: 'Search' });
        setNameChild(nameChild === "")
        setFirstnameChild(firstnameChild === "")
        setBirthDate(birthDate === "")
        dispatch(
          login({
            token: data.donnee.token,
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
            _id: data.donnee._id
          })
        );
      });
  };
  // creation d une fonction pour ajouté un document
  const handleDocument = () => {

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
          <Text style={styles.text2}>
            {user.children.length === 0
              ? "Ajouter un enfant"
              : user.children.length === 1
                ? "Vous avez ajouté un enfant"
                : `Vous avez ajouté ${user.children.length} enfants ajoutés`}
          </Text>
        </View>
        <View>
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
          onPress={() => handleDocument()}
          style={styles.joinDocBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Joindre des documents</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconContainer} onPress={() => handleSubmit(true)} >
          <FontAwesomeIcon icon={faUserPlus} style={styles.icon} size={50} color="#FFFFFF" />
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
          onPress={() => handleSubmit(false)}
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
    height: 51,  // Increased height for a larger input
    paddingHorizontal: 15,  // Added horizontal padding
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: 14,
    fontSize: 16, // Slightly larger font size for readability
    color: "#333333",  // Darker text for better contrast
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 347,
    height: 44,
    backgroundColor: '#EABBFF',
    borderRadius: 10,
    marginTop: 14,
    borderWidth: 2,
    borderColor: 'white',
  },
  textButton: {
    textAlign: "center",
    color: "white",
    fontWeight: 600,
    fontSize: 18,  // Increased font size for better readability
  },
  joinDocBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: 220,
    height: 40,  // Increased height for the button
    backgroundColor: "#98B9F2",
    borderRadius: 50,
    marginTop: 15,
    borderWidth: 2,
    borderColor: "white",
  },
  picker: {
    width: 347,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,  // Adjusted radius for a sleeker look
    overflow: "hidden",
  },
  pickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 347,
    height: 50,  // Increased height for picker
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 14,
  },
  size: {
    fontSize: 16, // Increased font size for easier readability
    color: "#B0B0B0",  // Darker color for better contrast
  },
  iconContainer: {
    marginTop: 15,
  },
});
