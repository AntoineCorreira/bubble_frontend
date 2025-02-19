import { View, Text, StyleSheet, ImageBackground, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Linking } from 'react-native';
import { useSelector } from 'react-redux';
import { useState } from 'react';

const serveurIP = process.env.EXPO_PUBLIC_SERVEUR_IP;

export default function ContactScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [object, setObject] = useState('');
    const establishment = useSelector((state) => state.establishment.value);
    const user = useSelector((state) => state.user.value);
    const searchCriteria = useSelector((state) => state.searchCriteria);

    const formatdate = (newDate) => {
        if (!newDate) return ''; // Si la date est null ou undefined, retourner une chaîne vide
        const date = new Date(newDate);
        const day = String(date.getDate()).padStart(2, '0'); // Jour (19)
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois (12)
        const year = date.getFullYear(); // Année (2024)
        return `${day}/${month}/${year}`;
    };

    const getDefaultMessage = () => {
        if (searchCriteria.startDate && searchCriteria.endDate && user.firstname && user.name) {
            return `Bonjour,

Je souhaite faire garder mon enfant sur la période du ${formatdate(searchCriteria.startDate)} au ${formatdate(searchCriteria.endDate)} dans votre crèche. 

Pouvez-vous me confirmer qu'il est possible pour vous
d'accueillir mon enfant sur cette période ?

Cordialement,
${user.firstname} ${user.name}`;
        }

        return `Bonjour,

Je souhaite faire garder mon enfant sur la période du 01/01/2025 au 03/01/2025 dans votre crèche. 

Pouvez-vous me confirmer qu'il est possible pour vous
d'accueillir mon enfant sur cette période ?

Cordialement,
M. Dupont`;
    };

    const [message, setMessage] = useState(getDefaultMessage());

    // Fonction pour envoyer un email
    const sendEmail = () => {
        fetch(`https://bubble-backend-peach.vercel.app/mails/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: establishment.mail,
                cc: email,
                subject: object,
                text: message
            })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    console.log(data);
                    navigation.navigate('Validation');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={styles.background}
        >
            <FontAwesome5
                style={styles.return}
                name="chevron-left"
                size={30}
                color="#FFFFFF"
                onPress={() => navigation.navigate('Establishment')}
            />
            <Text style={styles.title}>BUBBLE</Text>
            <View style={styles.content}>
                <ScrollView contentContainerStyle={styles.informations}>
                    {/* Informations de contact */}
                    <View style={styles.contactRow}>
                        <FontAwesome5 name="phone" size={30} color="#FFFFFF" style={styles.icon} />
                        <TouchableOpacity onPress={() => establishment.phone ? Linking.openURL(`tel:${establishment.phone}`) : alert('Numéro de téléphone non disponible')}>
                            <Text style={styles.text}>{establishment.phone}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contactRow}>
                        <FontAwesome5 name="at" size={30} color="#FFFFFF" style={styles.icon} />
                        <Text style={styles.text}>
                            {establishment && establishment.mail ? establishment.mail : 'Non disponible'}
                        </Text>
                    </View>
                    {/* Champ message et bouton envoyer */}
                    <View style={styles.messageBox}>
                        <TextInput
                            style={styles.mailUser}
                            placeholder={`Mail : ${user.email}`}
                            onChangeText={(value) => setEmail(value)}
                            value={email}
                        />
                        <TextInput
                            style={styles.objectInput}
                            placeholder="Objet: Demande d'informations"
                            onChangeText={(value) => setObject(value)}
                            value={object}
                        />
                        <TextInput
                            style={styles.messageInput}
                            multiline={true}
                            placeholder="Écrivez votre message ici"
                            onChangeText={(value) => setMessage(value)}
                            value={message}
                        />
                    </View>
                    <TouchableOpacity style={styles.sendButton} onPress={sendEmail}>
                        <Text style={styles.sendButtonText}>Envoyer</Text>
                    </TouchableOpacity>
                </ScrollView>
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
    informations: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF20', // Fond blanc transparent
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 10,
        width: '90%',
    },
    icon: {
        marginRight: 15,
    },
    text: {
        fontSize: 18,
        color: '#FFFFFF',
        flexShrink: 1, // Gestion des textes longs
    },
    messageBox: {
        width: '90%',
        backgroundColor: 'transparent',
        borderRadius: 10,
        padding: 15,
    },
    mailUser: {
        fontSize: 16,
        color: 'black',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginVertical: 10,
    },
    objectInput: {
        fontSize: 16,
        color: 'black',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
    },
    messageInput: {
        fontSize: 16,
        color: 'black',
        backgroundColor: '#FFFFFF',
        minHeight: 120,
        textAlignVertical: 'top', // Alignement pour les zones de texte
        borderRadius: 10,
        marginVertical: 10,
    },
    sendButton: {
        marginTop: 10,
        backgroundColor: '#EABBFF',
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        width: 185,
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
