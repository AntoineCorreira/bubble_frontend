import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
// import { Navigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { login } from '../reducers/user';
import * as Font from 'expo-font';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
// import pour la connection google
import { useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
// Complète les sessions d'authentification pour Expo Go
WebBrowser.maybeCompleteAuthSession();
// import { EXPO_PUBLIC_SERVEUR_IP } from '@env';

// Configuration OAuth Google
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

const serveurIP = process.env.EXPO_PUBLIC_SERVEUR_IP;
console.log('Serveur IP:', serveurIP);

export default function LoginScreen({ navigation }) {
  //pour chaques champ un hook d etat
  const [emailSignup, setEmailSignup] = useState('');
  const [passwordSignup, setPasswordSignup] = useState('');
  const [emailSignin, setEmailSignin] = useState('')
  const [passwordSignin, setPasswordSignin] = useState('')
  //etats qui sert a envoyer un message si le email ou mot de passe pas valide
  const [emailError, setEmailError] = useState(false);
  const [emailError1, setEmailError1] = useState(false);
  const [emailError2, setEmailError2] = useState(false);
  //etat pour recup info user avec connection google
  const [user, setUser] = React.useState(null);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(true);
  // importer la police du titre 
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Lily Script One': require('../assets/fonts/LilyScriptOne-Regular.ttf'),
      });
    };
    loadFonts();
  }, []);

  // fonction pour le signup
  const handleSubmit = () => {
    // creation d un pattern pour avoir le bon format d email.
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (pattern.test(emailSignup)) {
      fetch(`http://${serveurIP}:3000/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailSignup, password: passwordSignup })
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data.result) {
            dispatch(login({ email: emailSignup, token: data.token }))
            navigation.navigate('Info');
            setEmailSignup(emailSignup === '');
            setPasswordSignup(passwordSignup === '');
          } else { setEmailError1('true') }
        })
    } else {
      setEmailError(true)
    }
  };

  //fonction pour le signin
  const handleLogin = () => {

    fetch(`http://${serveurIP}:3000/users/signin`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ email: emailSignin, password: passwordSignin })
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          console.log('fetch sigin', data)
          navigation.navigate('TabNavigator', { screen: 'Search' });
          setEmailSignin(emailSignin === '');
          setPasswordSignin(passwordSignin === '');
          dispatch(
            login({
              token: data.token,
              email: data.email,
              name: data.name,
              firstname: data.firstname,
              civility: data.civility,
              address: data.address,
              city: data.city,
              zip: data.zip,
              phone: data.phone,
              type: data.type,
              children: data.children,
              _id: data._id
            })
          );
        } else {
          setEmailError2(true)
        }
      })
  };

  // Configuration de la requête
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '',
      redirectUri: 'https://auth.expo.dev/@your-username/my-app',
      scopes: ['openid', 'profile'],
    },
    discovery
  );

  // Gestion de la réponse
  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      // Récupérer les informations utilisateur
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setUser(user)
        })
        .catch((error) => console.error('Erreur lors de la récupération des données utilisateur :', error));
    }
  }, []);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword); // Inverse l'état pour afficher ou masquer le mot de passe
  };

  return (

    <ImageBackground style={styles.imageBackground} source={require('../assets/background.png')}>
      <KeyboardAvoidingView style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Différent comportement pour iOS et Android
      >
        <Text style={styles.title}>BUBBLE</Text>
        <View style={styles.logoutContainer}>
          <Text style={styles.text}>S'INSCRIRE</Text>
          <TextInput style={styles.input} onChangeText={(value) => setEmailSignup(value)} value={emailSignup} placeholder='Email' placeholderTextColor='#999999' />
          {emailError && <Text style={styles.errorText}>Email pas valide</Text>}
          {emailError1 && <Text style={styles.errorText}>Email déja utilisée</Text>}
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputEyes} onChangeText={(value) => setPasswordSignup(value)} value={passwordSignup} placeholder='Mot de passe' placeholderTextColor='#999999' secureTextEntry={showPassword} />
            <TouchableOpacity onPress={handlePasswordVisibility} >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} style={styles.icon} size={25} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => handleSubmit()} style={styles.button} activeOpacity={0.8}>
              <Text style={styles.textButton}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.text}>SE CONNECTER</Text>
          <TextInput style={styles.input} onChangeText={(value) => setEmailSignin(value)} value={emailSignin} placeholder='Email' placeholderTextColor='#999999' />
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputEyes} onChangeText={(value) => setPasswordSignin(value)} value={passwordSignin} placeholder='Mot de passe' placeholderTextColor='#999999' secureTextEntry={showPassword} />
            <TouchableOpacity onPress={handlePasswordVisibility} >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} style={styles.icon} size={25} color="black" />
            </TouchableOpacity>
          </View>
          {emailError2 && <Text style={styles.errorText}>Email ou mot de passe non valide</Text>}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => handleLogin()} style={styles.buttonConnexion} activeOpacity={0.8}>
              <Text style={styles.textButtonConnexion}>Se connecter</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => promptAsync()} style={styles.buttonGoogle} activeOpacity={0.8}>
              <Text style={styles.textButtonGoogle}>Se connecter avec Google</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  )

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  logoutContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 600,
    marginTop: 10,
  },
  textButton: {
    fontSize: 20,
    marginLeft: 20,
    textAlign: 'center',
    color: 'white',
    fontWeight: 600,
  },
  textButtonConnexion: {
    fontSize: 20,
    fontWeight: 600,
    marginLeft: 20,
    textAlign: 'center',
    color: 'white',
  },
  textButtonGoogle: {
    fontSize: 20,
    fontWeight: 600,
    marginLeft: 20,
    textAlign: 'center',
    color: '#EABBFF',
  },
  input: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 347,
    height: 51,
    paddingLeft: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 14,
    fontSize: 16,
  },
  inputContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: 347,
    height: 51,
    paddingLeft: 20,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 347,
    height: 44,
    paddingRight: 30,
    backgroundColor: '#98B9F2',
    borderRadius: 10,
    marginTop: 14,
    borderWidth: 2,
    borderColor: 'white'
  },
  buttonConnexion: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 347,
    height: 44,
    paddingRight: 30,
    backgroundColor: '#EABBFF',
    borderRadius: 10,
    marginTop: 14,
    borderWidth: 2,
    borderColor: 'white'
  },
  buttonGoogle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 347,
    height: 44,
    paddingRight: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 14,
    borderWidth: 2,
    borderColor: '#EABBFF'
  },
  errorText: {
    color: 'red'
  },
  inputEyes: {
    fontSize: 16,
    flex: 1
  }
})