import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function ContactScreen({ navigation }) {
    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={styles.background}
        >
                <TouchableOpacity
                    style={styles.return}
                    onPress={() => navigation.navigate('Search')}
                >
                    <FontAwesome5
                        name="times" // Icône de croix
                        size={30}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>
                <Text style={styles.title}>BUBBLE</Text>

            <View style={styles.content}>
                <Text style={styles.message}>
                    Merci pour votre confiance ! {'\n'}{'\n'}{'\n'}
                    Votre demande a bien été transmise à l'établissement. {'\n'}{'\n'}{'\n'}
                    Vous serez informé de son traitement par email et recevrez également une notification dans un délai de 48h !
                </Text>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    return: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    title: {
        fontFamily: 'Lily Script One',
        fontSize: 36,
        color: '#FFFFFF',
        marginTop: 30,
        width: 140,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        fontSize: 18,
        color: '#FFFFFF', // Texte blanc
        textAlign: 'center', // Centrer le texte
        paddingHorizontal: 20, // Espacement horizontal
    },
});
