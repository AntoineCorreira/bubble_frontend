import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../reducers/user';
import Svg, { Rect, Path } from 'react-native-svg'; // Importation de react-native-svg pour dessiner des cases personnalisées

// Récupérer l'adresse du serveur à partir des variables d'environnement
const serveurIP = process.env.EXPO_PUBLIC_SERVEUR_IP;

export default function CoordonneeScreen({ navigation }) {
  // États locaux pour gérer l'état des champs de saisie
  const [isMonsieurSelected, setMonsieurSelected] = useState(false); // Sélection pour "Monsieur"
  const [isMadameSelected, setMadameSelected] = useState(false); // Sélection pour "Madame"
  const [civility, setCivility] = useState(''); // Civilité (Monsieur ou Madame)
  const [name, setName] = useState(''); // Nom de l'utilisateur
  const [firstname, setFirstname] = useState(''); // Prénom de l'utilisateur
  const [adress, setAdress] = useState(''); // Adresse de l'utilisateur
  const [city, setCity] = useState(''); // Ville de l'utilisateur
  const [zip, setZip] = useState(''); // Code postal de l'utilisateur
  const [phone, setPhone] = useState(''); // Numéro de téléphone de l'utilisateur

  // Récupérer les données de l'utilisateur actuel à partir du store Redux
  const user = useSelector((state) => state.user.value);
  const Dispatch = useDispatch();

  // Fonction pour soumettre les données de l'utilisateur au serveur
  const handleSubmit = () => {
    // Faire une requête POST pour envoyer les données utilisateur au serveur
    fetch(`https://bubble-backend-peach.vercel.app/users/addData`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        civility: civility,
        name: name,
        firstname: firstname,
        address: adress,
        city: city,
        zip: zip,
        phone: phone,
        token: user.token // Inclure le token utilisateur pour l'authentification
      })
    })
      .then(response => response.json()) // Attendre la réponse JSON du serveur
      .then(data => {
        console.log('fetch addData', data.dataBdd); // Afficher la réponse dans la console
        if (data.dataBdd.token) {
          // Si la réponse contient un token, naviguer vers l'écran "Enfant"
          navigation.navigate('Enfant');
          // Mettre à jour l'état de l'utilisateur dans Redux avec le nouveau token
          Dispatch(login({ _id: data.dataBdd._id, token: data.dataBdd.token, children: [] }));
        }
      })
      .catch((error) => {
        // Gérer les erreurs en cas d'échec de la requête
        console.error("Erreur lors de l'envoi des données :", error);
      });
  };

  // Fonction pour gérer la sélection de la civilité (Monsieur ou Madame)
  const handleSelection = (selectedGender) => {
    if (selectedGender === 'Monsieur') {
      setCivility(selectedGender); // Mettre à jour la civilité à "Monsieur"
      setMonsieurSelected(true); // Sélectionner "Monsieur"
      setMadameSelected(false); // Désélectionner "Madame"
    } else if (selectedGender === 'Madame') {
      setCivility(selectedGender); // Mettre à jour la civilité à "Madame"
      setMadameSelected(true); // Sélectionner "Madame"
      setMonsieurSelected(false); // Désélectionner "Monsieur"
    }
  };

  // Fonction pour rendre une case à cocher personnalisée avec SVG
  const renderCheckbox = (selected) => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Rect x="2" y="2" width="20" height="20" stroke={selected ? '#ffffff' : '#FFFFFF'} strokeWidth="2" fill={selected ? '#EABBFF' : 'transparent'} />
      {selected && <Path d="M7 12l5 5L17 8" stroke="white" strokeWidth="2" fill="none" />}
    </Svg>
  );

  return (
    <ImageBackground style={styles.imageBackground} source={require('../assets/background.png')}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.title}>BUBBLE</Text>
        <View style={styles.header}>
          <Text style={styles.text1}>Mes coordonnées</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <Text style={styles.text2}>Civilité</Text>
          <View style={styles.checkboxes}>
            <TouchableOpacity style={styles.checkbox} onPress={() => handleSelection('Monsieur')}>
              {renderCheckbox(isMonsieurSelected)}
              <Text style={styles.checkboxLabel}>Monsieur</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkbox} onPress={() => handleSelection('Madame')}>
              {renderCheckbox(isMadameSelected)}
              <Text style={styles.checkboxLabel}>Madame</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} onChangeText={(value) => setName(value)} value={name} placeholder='Nom' placeholderTextColor='#999999' />
          <TextInput style={styles.input} onChangeText={(value) => setFirstname(value)} value={firstname} placeholder='Prénom' placeholderTextColor='#999999' />
          <TextInput style={styles.input} onChangeText={(value) => setAdress(value)} value={adress} placeholder='Adresse' placeholderTextColor='#999999' />

          <View style={styles.adresseContainer}>
          <TextInput style={styles.cp} onChangeText={(value) => setZip(value)} value={zip} placeholder='Code Postal' placeholderTextColor='#999999' />
            <TextInput style={styles.ville} onChangeText={(value) => setCity(value)} value={city} placeholder='Ville' placeholderTextColor='#999999' />
          </View>
          <TextInput style={styles.input} onChangeText={(value) => setPhone(value)} value={phone} placeholder='Téléphone' placeholderTextColor='#999999' />
        </View>

        <TouchableOpacity onPress={() => handleSubmit()} style={styles.button} activeOpacity={0.8}>
          <Text style={styles.textButton}>Sauvegarder</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Occuper toute la hauteur de l'écran
    justifyContent: 'center', // Centrer verticalement
    alignItems: 'center', // Centrer horizontalement
    padding: 20, // Ajouter un peu de padding pour espacer les éléments
  },
  imageBackground: {
    flex: 1,
    width: '100%', // Prendre toute la largeur
    justifyContent: 'center', // Centrer l'arrière-plan
    alignItems: 'center', // Centrer l'arrière-plan
  },
  title: {
    fontFamily: 'Lily Script One',
    fontSize: 36,
    color: '#FFFFFF',
    marginTop: 30,
    textAlign: 'center', // Centrer horizontalement
  },
  text1: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center', // Centrer horizontalement
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Aligner les éléments sur la gauche
    alignItems: 'center', // Centrer verticalement les éléments
    marginTop: 20, // Ajuster l'espacement général si nécessaire
    marginBottom: 14,
    width: 347,
    paddingLeft: 20,
  },
  checkboxes: {
    flexDirection: 'row', // Disposer les cases à cocher horizontalement
    marginLeft: 10, // Légèrement espacé du texte "Civilité"
  },
  text2: {
    fontSize: 18,
    color: 'white',
    marginRight: 10, // Ajouter de l'espace entre le texte et les cases à cocher
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5, // Espacement horizontal entre les cases
  },
  checkboxLabel: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10, // Espacement entre la case et le texte
  },
  inputContainer: {
    width: '100%', // Prendre toute la largeur disponible
    marginTop: -10,
    alignItems: 'center', // Centrer les champs de saisie
  },
  input: {
    width: 347,
    height: 51,
    paddingLeft: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 14,
    fontSize: 16, // Ajouter la taille de police pour le placeholder
  },
  ville: {
    width: 200,
    height: 51,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 14,
    paddingLeft: 20,
    fontSize: 16, // Ajouter la taille de police pour le placeholder
  },
  cp: {
    width: 142,
    height: 51,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 14,
    marginRight: 5,
    paddingLeft: 20,
    fontSize: 16, // Ajouter la taille de police pour le placeholder
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
    color: 'white',
    fontWeight: '600',
    fontSize: 20,
  },
  adresseContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Centrer horizontalement
  },
});
