import { View, Text, StyleSheet, ImageBackground, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Mailer from 'react-native-mail'; // Import de react-native-mail
import { useSelector } from 'react-redux';

export default function ContactScreen({ navigation }) {
    const establishment = useSelector((state) => state.establishment.value);
    console.log('Establishment:', establishment);
    const user = useSelector((state) => state.user.value);
    // const searchCriteria = useSelector((state) => state.searchCriteria.value)

    const searchCriteria = {
        city: 'Bordeaux',
        startDate: '13/12/2024',
        endDate: '13/12/2024',
        childName: 'Lio'
    }

    const defaultMessage = `Bonjour,

Je souhaite faire garder mon enfant ${searchCriteria.childName} sur la période du ${searchCriteria.startDate} au 
${searchCriteria.endDate} dans votre crèche. 

Pouvez-vous me confirmer qu'il est possible pour vous
d'accueillir mon enfant sur cette période ?

Cordialement,
${user.firstname} ${user.name}`;

    // Fonction pour ouvrir l'application mail
    const sendEmail = () => {
        console.log('Establishment mail', establishment.mail);
        if (!establishment || !establishment.mail) {
            console.warn("Les informations de l'établissement sont manquantes.");
            return;
        }

        Mailer.send(
            {
                subject: "Demande de garde d'enfant",
                recipients: ['antoine.correira@gmail.com'], // Adresse de l'établissement
                body: defaultMessage, // Corps du message
                isHTML: false, // Si le contenu doit être interprété comme HTML
            },
            (error, event) => {
                if (error) {
                    console.warn("Erreur lors de l'envoi de l'email :", error);
                } else {
                    console.log('Email envoyé avec succès :', event);
                }
            }
        );
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
                onPress={() => navigation.navigate('Search')}
            />
            <Text style={styles.title}>BUBBLE</Text>
            <View style={styles.content}>
                <ScrollView contentContainerStyle={styles.informations}>
                    {/* Informations de contact */}
                    <View style={styles.contactRow}>
                        <FontAwesome5 name="phone" size={30} color="#FFFFFF" style={styles.icon} />
                        <Text style={styles.text}>{establishment.phone}</Text>
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
                            style={styles.messageInput}
                            multiline={true}
                            defaultValue={defaultMessage}
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={() => sendEmail()}>
                            <Text style={styles.sendButtonText}>Envoyer</Text>
                        </TouchableOpacity>
                    </View>
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
        marginTop: 20,
        width: '90%',
        backgroundColor: '#FFFFFF20', // Fond blanc transparent
        borderRadius: 10,
        padding: 15,
    },
    messageInput: {
        fontSize: 16,
        color: '#FFFFFF',
        minHeight: 120,
        textAlignVertical: 'top', // Alignement pour les zones de texte
    },
    sendButton: {
        marginTop: 10,
        backgroundColor: '#EABBFF',
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF'
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});