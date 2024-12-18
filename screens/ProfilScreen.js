import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ImageBackground, Modal, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { updateUser } from '../reducers/user';
import { CheckBox } from 'react-native-elements';

const ProfileScreen = () => {
  // Récupération de l'utilisateur à partir du store Redux
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  // États locaux pour gérer l'édition, l'entrée de texte et l'affichage des erreurs
  const [editingField, setEditingField] = useState(null); // Champ actuellement en édition
  const [inputValue, setInputValue] = useState(''); // Valeur du champ en cours d'édition
  const [modalVisible, setModalVisible] = useState(false); // Affichage de la modal pour les types
  const [typesOfCare, setTypesOfCare] = useState([]); // Liste des types de garde récupérés
  const [selectedTypes, setSelectedTypes] = useState([]); // Types de garde sélectionnés
  const [errorMessage, setErrorMessage] = useState(''); // Message d'erreur pour la validation

  // Liste des champs non modifiables
  const nonEditableFields = ['token', '_id', '_v'];

  // Fonction pour récupérer les types de garde depuis l'API
  const fetchTypes = async () => {
    try {
      const response = await fetch(`http://192.168.1.129:3000/establishments/type`);
      const data = await response.json();
      if (response.ok) {
        setTypesOfCare(data); // Stocker les types dans l'état
        setSelectedTypes(user.type ? [user.type] : []); // Mettre le type de garde par défaut si il existe
      } else {
        console.error('Error fetching types:', data);
      }
    } catch (error) {
      console.error('Error fetching types:', error);
    }
  };

  // Ouvre la modal pour sélectionner un type de garde
  const openModal = () => {
    fetchTypes(); // Charger les types avant d'ouvrir la modal
    setModalVisible(true); // Afficher la modal
  };

  // Ferme la modal
  const closeModal = () => setModalVisible(false);

  // Fonction pour sélectionner/désélectionner un type de garde
  const handleCheckboxChange = (type) => {
    setSelectedTypes([type]); // Sélectionne un seul type de garde
  };

  // Sauvegarder les types sélectionnés dans Redux
  const handleSave = () => {
    if (selectedTypes.length > 0) {
      dispatch(updateUser({ type: selectedTypes[0] })); // Mettre à jour l'utilisateur dans Redux
    }
    closeModal(); // Fermer la modal après l'enregistrement
  };

  // Fonction pour démarrer l'édition d'un champ
  const startEditing = (field, value) => {
    setEditingField(field); // Définir le champ en cours d'édition
    setInputValue(value); // Définir la valeur actuelle du champ
    setErrorMessage(''); // Réinitialiser les erreurs éventuelles
  };

  // Fonction pour sauvegarder l'édition d'un champ
  const saveEdit = (field) => {
    if (inputValue !== '') {
      if (field === 'phone' && !validatePhone(inputValue)) {
        setErrorMessage('Numéro de téléphone invalide.'); // Message d'erreur pour téléphone invalide
        return;
      }

      if (field === 'email' && !validateEmail(inputValue)) {
        setErrorMessage('Adresse email invalide.'); // Message d'erreur pour email invalide
        return;
      }

      // Mettre à jour l'état de l'utilisateur dans Redux avec la nouvelle valeur
      dispatch(updateUser({ [field]: inputValue }));
      setEditingField(null); // Quitter le mode d'édition
    }
  };

  // Validation du téléphone (numéro français)
  const validatePhone = (phone) => {
    const phoneRegex = /^(0[1-9])([-. ]?[0-9]{2}){4}$/;
    return phoneRegex.test(phone); // Vérifie si le numéro correspond à la regex
  };

  // Validation de l'email
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email); // Vérifie si l'email correspond à la regex
  };

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Profil</Text> 
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={{ paddingBottom: 50 }} // Espace en bas pour éviter le chevauchement
          showsVerticalScrollIndicator={false} // Cache la barre de défilement
        >
          <View style={styles.container}>
            {Object.keys(user)
              .filter((field) => !nonEditableFields.includes(field)) // Exclure les champs non modifiables
              .map((field) => (
                <View key={field} style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}:</Text>
                  {editingField === field ? (
                    <>
                      {/* Zone de saisie pour modifier le champ */}
                      <TextInput
                        style={styles.input}
                        value={inputValue}
                        onChangeText={setInputValue} // Mettre à jour la valeur à chaque saisie
                        placeholder={typeof user[field] === 'object' ? JSON.stringify(user[field]) : user[field]} // Afficher la valeur par défaut
                        onBlur={() => saveEdit(field)} // Appeler saveEdit lors de la perte de focus
                        autoFocus // Met le focus sur ce champ lors de l'édition
                      />
                      {/* Affichage d'un message d'erreur, si nécessaire */}
                      {errorMessage ? (
                        <Text style={styles.errorMessage}>{errorMessage}</Text>
                      ) : null}
                    </>
                  ) : (
                    <View style={styles.fieldValueContainer}>
                      {/* Affichage des valeurs (en texte) pour les champs non modifiables */}
                      {Array.isArray(user[field]) ? (
                        user[field].map((child, index) => (
                          <Text key={`${field}-${index}`} style={styles.fieldValue}>
                            {child.firstnamechild} {child.namechild} (Né(e) le : {child.birthdate})
                          </Text>
                        ))
                      ) : (
                        <Text style={styles.fieldValue}>{typeof user[field] === 'object' ? JSON.stringify(user[field]) : user[field]}</Text>
                      )}
                      {/* Icône pour permettre l'édition */}
                      <TouchableOpacity
                        style={styles.editIcon}
                        onPress={() => (field === 'type' ? openModal() : startEditing(field, user[field]))}
                      >
                        <FontAwesome name="edit" size={20} color="#000" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

// Styles de la page
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    paddingTop: 60, // Décalage depuis le haut
    paddingHorizontal: 20, // Marge latérale
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Fond blanc opaque pour contraste
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Ombre pour Android
  },
  fieldContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    paddingBottom: 10,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7d7d7d', // Gris doux
    marginBottom: 5,
  },
  fieldValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldValue: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#f9f9f9',
  },
  editIcon: {
    marginLeft: 10,
    backgroundColor: '#f2f2f2',
    padding: 8,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#EABBFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonClose: {
    backgroundColor: '#98B9F2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
