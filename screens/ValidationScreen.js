import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function ContactScreen({ navigation }) {
    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={styles.background}
        >
            <View style={styles.header}>
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
            </View>

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
        justifyContent: 'center', // Centrer verticalement
        alignItems: 'center', // Centrer horizontalement
    },
    header: {
        flexDirection: 'row', // Alignement horizontal pour l'icône et le titre
        alignItems: 'center', // Centrer verticalement l'icône et le titre
        position: 'absolute', // Permet de les fixer en haut
        top: 40,
        left: 20,
        right: 0,
        zIndex: 1, // Assurer que l'icône et le titre sont au-dessus du contenu
        width: '100%', // S'assurer que le parent prend toute la largeur
    },
    return: {
        marginRight: 10, // Espacement entre l'icône et le titre
    },
    title: {
        fontFamily: 'Lily Script One',
        fontSize: 36,
        color: '#FFFFFF', // Texte blanc
        textAlign: 'center', // Centrer le titre
        flex: 1, // Laisser le titre prendre toute la largeur disponible
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100, // Décalage pour le contenu sous l'icône et le titre
    },
    message: {
        fontSize: 18,
        color: '#FFFFFF', // Texte blanc
        textAlign: 'center', // Centrer le texte
        paddingHorizontal: 20, // Espacement horizontal
    },
});
