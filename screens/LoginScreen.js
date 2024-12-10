import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput } from 'react-native'
// import { Navigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { login, logout} from '../reducers/user';

export default function LoginScreen({ navigation }) {
   //pour chaques champ un hook d etat
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //etat qui sert a envoyer un message si le email n est pas valide
    const [emailError, setEmailError] = useState(false);

const user = useSelector((state)=>state.user.value)
console.log(user)
    const dispatch = useDispatch()

// fonction pour le signup
    const handleSubmit = () => {
         // creation d un pattern pour avoir le bon format d email.
         const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
         if(pattern.test(email)){
          
            fetch('http://192.168.1.53:3000/users/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: email, password : password})
            })
            .then(response => response.json())
            .then(data=>{
             console.log(data)
                dispatch(login(data.token))
                navigation.navigate('TabNavigator', { screen: 'Search' });
            })
         }else{
           setEmailError(true)
         }
    }

    const handleLogin = () => {

    }

    return (
        <ImageBackground style={styles.imageBackground}source={require('../assets/background.png')}>
          <Text style={styles.title}>BUBBLE</Text>
            <View style={styles.logoutContainer}>
              <Text style={styles.text}>Je n'ai pas de compte</Text>
              <TextInput style={styles.input} onChangeText={(value)=>setEmail(value)} value={email} placeholder='Email' placeholderTextColor='#999999'/>
                {emailError && <Text style={styles.errorText}>Email pas valide</Text>}
              <TextInput style={styles.input} onChangeText={(value)=>setPassword(value)} value={password} placeholder='Mot de passe' placeholderTextColor='#999999'/>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleSubmit()} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.textButton}>S'inscrire</Text>
                </TouchableOpacity>
                <Text style={styles.text}>ou</Text>
                <TouchableOpacity onPress={() => handleGoogleSignout()} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.textButton}>S'inscrire avec Google</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.text}>J'ai déja un compte</Text>
              <TextInput style={styles.input}  placeholder='Email' placeholderTextColor='#999999'/>
              <TextInput style={styles.input}  placeholder='Mot de passe' placeholderTextColor='#999999'/>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleLogin()} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.textButton}>Ce connecter</Text>
                </TouchableOpacity>
                <Text style={styles.text}>ou</Text>
                <TouchableOpacity onPress={() => handleGoogleSignin()} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.textButton}>Ce connecter avec Google</Text>
                </TouchableOpacity>
              </View>
            </View>
        </ImageBackground>
    )
}


const styles = StyleSheet.create({
  imageBackground:{
   flex: 1,
   alignItems: 'center',
  },
  title:{
    fontFamily: 'Lily Script One',
    fontSize: 36,
    color: '#FFFFFF',
    marginTop: 30,
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
  buttonContainer:{
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10
  },
  textButton:{
    marginLeft: 20,
    textAlign:'center',
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    width: 347,
    height: 51,
    paddingRight: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 10,
    },
 button:{
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
    errorText:{
    color: 'red'
    }
})