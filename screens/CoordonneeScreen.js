import { ImageBackground, TouchableOpacity, StyleSheet, Text, View, KeyboardAvoidingView, Platform, TextInput } from 'react-native'// import de KeyboardAvoidingView et Platform pour probleme clavier qui cache input
import React, {  useState } from 'react'
import { login } from '../reducers/user';
import React, {  useState } from 'react'
import { login } from '../reducers/user';
//utilisation de redux useSelector pour recuperer le token pour le fetch
import { useDispatch, useSelector } from 'react-redux';
//import de la bibliotheque expo-checkbox
import { Checkbox } from 'expo-checkbox';

const serveurIP = process.env.EXPO_PUBLIC_SERVEUR_IP;
console.log('Serveur IP:', serveurIP);

//ajout du module navigation
export default function CoordonneeScreen({navigation}) {
  const [isMonsieurSelected, setMonsieurSelected] = useState(false);
  const [isMadameSelected, setMadameSelected] = useState(false);
  //tout les etats de champs
  const [civility, setCivility] = useState('');
  const [name, setName] = useState('');
  const [firstname, setFirstname] = useState('');
  const [adress, setAdress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  
//utilisation du useSelector pour recuperer la valeur du token
  const user = useSelector((state)=>state.user.value)
  const Dispatch= useDispatch()
// creation de la fonction handleSubmit pour sauvegarder toutes les nouvelles données de l'utilisateur
     const handleSubmit = () => {
     fetch(`http://${serveurIP}:3000/users/addData`, {
      method: 'POST',
      headers: {'Content-type' : 'application/json'},
      body: JSON.stringify({ civility: civility, name: name, firstname: firstname, address: adress, city: city, zip: zip, phone: phone, token : user.token })
      })
      .then( response => response.json())
      .then(data=>{ console.log('fetch addData',data.dataBdd.token)
        if(data.dataBdd.token){
          navigation.navigate('Enfant');
          Dispatch(login({token : data.dataBdd.token, children : []}))
        }
      })
  }
 
  // Fonction pour gérer la sélection (checkbox)
  const handleSelection = (selectedGender) => {
      if (selectedGender === 'Monsieur') {
      setCivility(selectedGender)  
      setMonsieurSelected(true);
      setMadameSelected(false); // Assure que l'autre est désélectionné
    } else if (selectedGender === 'Madame') {
      setCivility(selectedGender) 
      setMadameSelected(true);
      setMonsieurSelected(false); // Assure que l'autre est désélectionné
    }
  };

  return (
    <ImageBackground style={styles.imageBackground} source={require('../assets/background.png')}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.title}>BUBBLE</Text>
        <View style={styles.header}>
          <Text style={styles.text1}>Mes coordonnées</Text>
        </View>
        <Text style={styles.text2}>Civilité</Text>

        <View style={styles.checkboxContainer}>
          {/* Case "Monsieur" */}
          <View style={styles.checkbox}>
            <Checkbox
              value={isMonsieurSelected}
              onValueChange={() => handleSelection('Monsieur')}
            />
            <Text style={styles.checkboxLabel}>Monsieur</Text>
          </View>
          {/* Case "Madame" */}
          <View style={styles.checkbox}>
            <Checkbox
              value={isMadameSelected}
              onValueChange={() => handleSelection('Madame')}
            />
            <Text style={styles.checkboxLabel}>Madame</Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
        <TextInput style={styles.input} onChangeText={(value)=>setName(value)} value={ name } placeholder='Nom' placeholderTextColor='#999999'/>
        <TextInput style={styles.input} onChangeText={(value)=>setFirstname(value)} value={ firstname } placeholder='Prénom' placeholderTextColor='#999999'/>
        <TextInput style={styles.input} onChangeText={(value)=>setAdress(value)} value={ adress } placeholder='Adresse' placeholderTextColor='#999999'/>

         <View style={styles.adresseContainer}>
         <TextInput style={styles.ville} onChangeText={(value)=>setCity(value)} value={ city } placeholder='Ville' placeholderTextColor='#999999'/>
         <TextInput style={styles.cp} onChangeText={(value)=>setZip(value)} value={ zip } placeholder='Code Postal' placeholderTextColor='#999999'/>
         </View>
         <TextInput style={styles.input} onChangeText={(value)=>setPhone(value)} value={ phone } placeholder='Téléphone' placeholderTextColor='#999999'/>
        </View>
        <TouchableOpacity onPress={() => handleSubmit()} style={styles.button} activeOpacity={0.8}>
        <Text style={styles.textButton}>Sauvegarder</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    flex: 1,
    alignItems: 'center',
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
    color: 'white',
    fontWeight: 'bold',
    marginTop: 30
  },
  text2: {
    fontSize: 18,
    color: 'white',
    marginTop: 20,
    marginRight: 200,
  },
  checkboxContainer: {
     flexDirection: 'row', // Permet de placer les checkboxes horizontalement
    justifyContent: 'space-between', // Espace entre les deux checkboxes
    width: '70%', // Ajuste la largeur du conteneur pour centrer les checkboxes
    marginTop: 20,
  },
  checkbox: {
    flexDirection: 'row', // Align les cases à cocher et les textes horizontalement
    alignItems: 'center',
    marginBottom: 15, // Ajoute un peu d'espace entre les checkboxes
  },
  checkboxLabel: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  inputContainer: {
    marginTop: -10,
  },
  input: {
    justifyContent:'center',
    alignItems:'center',
    width: 347,
    height: 40,
    paddingRight: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 10,
    },
  ville: {
    width: 200,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 10,
  },
  cp: {
    width: 142,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 10,
    marginLeft:5
  },
  button: {
    justifyContent:'center',
    alignItems: 'center',
    width: 347,
    height: 40,
    paddingRight: 30,
    backgroundColor: '#98B9F2',
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 2,
    borderColor: 'white'
    },
  textButton: {
    marginLeft: 20,
    textAlign:'center',
    color: 'white',
    fontWeight: 'bold',
  },
  adresseContainer: {
    flexDirection:'row',
  }
});