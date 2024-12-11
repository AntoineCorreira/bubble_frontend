import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput } from 'react-native'
// import { Navigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { login, logout} from '../reducers/user';

export default function LoginScreen({ navigation }) {
   //pour chaques champ un hook d etat
    const [emailSignup, setEmailSignup] = useState('');
    const [passwordSignup, setPasswordSignup] = useState('');
    const [emailSignin, setEmailSignin] = useState('')
    const [passwordSignin, setPasswordSignin] = useState('')
    //etats qui sert a envoyer un message si le email ou mot de passe pas valide
    const [emailError, setEmailError] = useState(false);
    const [emailError2, setEmailError2] = useState(false);

    const user = useSelector((state)=>state.user.value)
  console.log(user)
    const dispatch = useDispatch()

     // fonction pour le signup
    const handleSubmit = () => {
         // creation d un pattern pour avoir le bon format d email.
         const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
         if(pattern.test( emailSignup)){
            fetch('http://192.168.1.53:3000/users/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: emailSignup, password : passwordSignup})
            })
            .then(response => response.json())
            .then(data=>{
                if(data.result){
                    dispatch(login({email: emailSignup, token : data.token}))
                    navigation.navigate('Info')
                    setEmailSignup(emailSignup === '')
                    setPasswordSignup(passwordSignup === '')   
                }
            })
         }else{
           setEmailError(true)
         }
    }

    //fonction pour le signin
    const handleLogin = () => {
       
            fetch('http://192.168.1.53:3000/users/signin', {
                method: 'POST',
                headers: {'Content-type' : 'application/json'},
                body: JSON.stringify({ email: emailSignin, password : passwordSignin})
              })
                .then(response => response.json())
                .then(data=>{
                  console.log(data)
                if(data.result){
                dispatch(login({email: emailSignup, token : data.token}))
                navigation.navigate('Info')
                setEmailSignin(emailSignin === '')
                setPasswordSignin(passwordSignin === '')
                        //navigation.navigate('TabNavigator', { screen: 'Search' })
                }else{ 
                    setEmailError2(true)
                }
                })
            }
    

    return (
        <ImageBackground style={styles.imageBackground}source={require('../assets/background.png')}>
          <Text style={styles.title}>BUBBLE</Text>
            <View style={styles.logoutContainer}>
              <Text style={styles.text}>Créé un compte</Text>
              <TextInput style={styles.input} onChangeText={(value)=>setEmailSignup(value)} value={ emailSignup } placeholder='Email' placeholderTextColor='#999999'/>
                {emailError && <Text style={styles.errorText}>Email pas valide</Text>}
              <TextInput style={styles.input} onChangeText={(value)=>setPasswordSignup(value)} value={ passwordSignup } placeholder='Mot de passe' placeholderTextColor='#999999'/>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleSubmit()} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.textButton}>S'inscrire</Text>
                </TouchableOpacity>
                <Text style={styles.text}>ou</Text>
                <TouchableOpacity onPress={() => navigation.navigate('TabNavigator', { screen: 'Search' })} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.textButton}>S'inscrire avec Google</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.text}>Ce connecter</Text>
              <TextInput style={styles.input} onChangeText={(value)=>setEmailSignin(value)} value={ emailSignin } placeholder='Email' placeholderTextColor='#999999'/>
              <TextInput style={styles.input} onChangeText={(value)=>setPasswordSignin(value)} value={ passwordSignin } placeholder='Mot de passe' placeholderTextColor='#999999'/>
              {emailError2 && <Text style={styles.errorText}>Email ou mot de passe non valide</Text>}
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