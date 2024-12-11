import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function CoordonneeScreen() {
  return (
    <ImageBackground style={styles.imageBackground} source={require('../assets/background.png')}>
      <Text style={styles.title} >BUBBLE</Text>
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
})