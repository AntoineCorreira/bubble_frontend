import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { updateUser, logout } from '../reducers/user';
import { useNavigation } from '@react-navigation/native';
import { setSearchCriteria } from '../reducers/searchCriteria';  // Assurez-vous d'importer l'action appropriée
import { StyleSheet } from 'react-native';

const ProfileScreen = () => {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const serveurIP = process.env.EXPO_PUBLIC_SERVEUR_IP;

  const [editingField, setEditingField] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalChildrenVisible, setModalChildrenVisible] = useState(false);
  const [modalTypesVisible, setModalTypesVisible] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [typesOfCare, setTypesOfCare] = useState([]);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [newChild, setNewChild] = useState({ firstname: '', namechild: '', birthdate: '' });
  const [childrenList, setChildrenList] = useState(user.children || []);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false); // Gérer si l'utilisateur modifie le mot de passe
  const [password, setPassword] = useState("");  // Mot de passe actuel
  const [newPassword, setNewPassword] = useState("");  // Nouveau mot de passe


  const nonEditableFields = ['token', '_id', '_v', 'email'];

  // Récupérer les enfants depuis l'API
  const fetchChildren = async () => {
    try {
      const response = await fetch(`http://${serveurIP}:3000/users/children?userId=${user._id}`);
      const childrenData = await response.json();
      if (response.ok) {
        dispatch(setSearchCriteria({ children: childrenData }));
      } else {
        console.error('Erreur lors de la récupération des enfants:', childrenData);
        setErrorMessage('Impossible de récupérer les enfants.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API des enfants:', error);
      setErrorMessage('Impossible de récupérer les enfants.');
    }
  };

  // Fonction pour récupérer les types de garde depuis l'API
  const fetchTypes = async () => {
    try {
      const response = await fetch(`http://${serveurIP}:3000/establishments/type`);
      const data = await response.json();
      if (response.ok) {
        setTypesOfCare(data); // Stocker les types dans l'état
        setSelectedTypes(user.type ? [user.type] : []); // Mettre à jour le type de garde par défaut
      } else {
        console.error('Erreur lors de la récupération des types :', data);
        setErrorMessage('Impossible de récupérer les types. Veuillez réessayer plus tard.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des types :', error);
      setErrorMessage('Impossible de récupérer les types. Veuillez réessayer plus tard.');
    }
  };
  
  useEffect(() => {
    fetchChildren();  // Récupérer les enfants lors du chargement du profil
  }, [user._id]);

  useEffect(() => {
    if (!inputValue) {
      setInputValue(user.firstname || ''); 
    }
  }, [user]);

  // Ouvre la modale pour sélectionner un type de garde
  const openModalTypes = () => {
    fetchTypes(); 
    setModalTypesVisible(true); 
  };

  const closeModalTypes = () => setModalTypesVisible(false);

  const handleCheckboxChange = (type) => {
    setSelectedTypes([type]);
  };

  const handleSaveType = () => {
    if (selectedTypes.length > 0) {
      dispatch(updateUser({ type: selectedTypes[0] }));
    }
    closeModalTypes();
  };

  const startEditing = (field, value) => {
    setEditingField(field);
    setInputValue(value);
    setErrorMessage('');
  };

  const saveEdit = async (field) => {
    if (inputValue !== '') {
      const userId = user._id;  // Utilisation de l'ID de l'utilisateur
      let updatedData = {};
  
      // Si le champ est 'children', envoyer un tableau avec l'enfant ajouté
      if (field === 'children') {
        updatedData.children = [ ...user.children, ...JSON.parse(inputValue) ];  // Ajoute l'enfant envoyé
      } else {
        updatedData = { [field]: inputValue };  // Sinon, traiter comme un champ classique
      }
  
      try {
        const response = await fetch(`http://${serveurIP}:3000/users/updateProfile/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });
  
        const result = await response.json();
  
        if (result.result) {
          console.log('Mise à jour réussie', result.updatedUser);
          dispatch(updateUser(result.updatedUser));  // Mettre à jour le store avec les nouvelles données
        } else {
          setErrorMessage(result.message);  // Afficher une erreur si la mise à jour échoue
        }
  
      } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        setErrorMessage('Une erreur est survenue lors de la mise à jour.');
      }
  
      setEditingField(null);  // Fermer le champ d'édition après la mise à jour
    }
  };

  
  const handleRemoveChild = async (childId) => {
    const userId = user._id;
  
    try {
      const response = await fetch(`http://${serveurIP}:3000/users/removeChild/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ childId }),
      });
  
      const result = await response.json();
      if (result.result) {
        console.log('Enfant supprimé avec succès');
        dispatch(updateUser(result.updatedUser));  // Mettre à jour le store
      } else {
        console.error('Erreur lors de la suppression de l\'enfant:', result.message);
      }
    } catch (error) {
      console.error('Erreur de requête:', error);
    }
  };

  const handleAddChild = async () => {
    const userId = user._id;
  
    try {
      const response = await fetch(`http://${serveurIP}:3000/users/addChild/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newChild: newChild }),  // Envoyer les données de l'enfant
      });
  
      const result = await response.json();
      if (result.result) {
        console.log('Enfant ajouté avec succès');
        dispatch(updateUser(result.updatedUser));  // Mettre à jour le store
      } else {
        console.error('Erreur lors de l\'ajout de l\'enfant:', result.message);
      }
    } catch (error) {
      console.error('Erreur de requête:', error);
    }
  };
  
  

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate('Login');
  };

  const handlePowerLogout = () => {
    dispatch(logout());
    navigation.navigate('Login');
  };

  const handleOpenChildrenModal = () => {
    setModalChildrenVisible(true);
  };

  const handleCloseChildrenModal = () => {
    setModalChildrenVisible(false);
  };

  const handleChildrenCheckboxChange = (childId) => {
    setSelectedChildren((prevSelected) =>
      prevSelected.includes(childId)
        ? prevSelected.filter((id) => id !== childId)
        : [...prevSelected, childId]
    );
  };

  const handleSaveChildren = () => {
    if (selectedChildren.length === 0) {
      setErrorMessage('Veuillez sélectionner au moins un enfant');
      return;
    }
    console.log('Enfants sélectionnés:', selectedChildren);
    handleCloseChildrenModal();
  };


  

  const closeModal = () => {
    setModalChildrenVisible(false); 
    setModalTypesVisible(false); 
  };

 
  

  

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Profil</Text>
        <TouchableOpacity style={styles.powerIcon} onPress={handlePowerLogout}>
          <FontAwesome name="power-off" size={30} color="#ffffff" />
        </TouchableOpacity>
      </View>
  
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 80 }}
        scrollEventThrottle={400}
      >
        {Object.keys(user)
          .filter((field) => !nonEditableFields.includes(field))
          .map((field) => (
            <View key={field} style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                {field.charAt(0).toUpperCase() + field.slice(1)}:
              </Text>
              <View style={styles.fieldBox}>
                {field === 'type' ? (
                  <TouchableOpacity onPress={openModalTypes}>
                    <Text style={styles.fieldValue}>
                      {user.type ? user.type : 'Aucun type sélectionné'}
                    </Text>
                    <FontAwesome name="edit" size={20} color="#000" style={styles.typeEditIcon} />
                  </TouchableOpacity>
                ) : editingField === field ? (
                  <>
                    <TextInput
                      style={styles.input}
                      value={inputValue || (typeof user[field] === 'object' ? JSON.stringify(user[field]) : user[field])}
                      onChangeText={setInputValue}
                      placeholder={typeof user[field] === 'object' ? JSON.stringify(user[field]) : user[field]}
                      onBlur={() => saveEdit(field)}
                      autoFocus
                    />
                    {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
                    <TouchableOpacity
                      style={styles.saveIcon}
                      onPress={() => saveEdit(field)}
                    >
                      <FontAwesome name="check" size={20} color="#28a745" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={styles.fieldValueContainer}>
                    {Array.isArray(user[field]) ? (
                      user[field].map((child, index) => (
                        <Text key={`${field}-${index}`} style={styles.fieldValue}>
                          {child.firstname} {child.namechild} (Né(e) le : {child.birthdate})
                        </Text>
                      ))
                    ) : (
                      <Text style={styles.fieldValue}>{typeof user[field] === 'object' ? JSON.stringify(user[field]) : user[field]}</Text>
                    )}
                    {field !== 'children' && (
                      <TouchableOpacity
                        style={styles.editIcon}
                        onPress={() => startEditing(field, user[field])}
                      >
                        <FontAwesome name="edit" size={20} color="#000" />
                      </TouchableOpacity>
                    )}
                    {field === 'children' && (
                      <TouchableOpacity
                        style={styles.editIcon}
                        onPress={handleOpenChildrenModal}
                      >
                        <FontAwesome name="edit" size={20} color="#000" />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>
          ))}
      </ScrollView>
      

      {/* Modal de types de garde */}
      <Modal
  animationType="slide"
  transparent={true}
  visible={modalTypesVisible}  
  onRequestClose={closeModalTypes}
>
  <View style={{
    flex: 1,
    justifyContent: 'center',  // Centre verticalement
    alignItems: 'center',      // Centre horizontalement
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }}>
    <View style={{
      width: '90%',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      alignSelf: 'center'      // Centre horizontalement
    }}>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
      }}>Sélectionner un type de garde</Text>
      
      <ScrollView style={{ marginBottom: 20 }}>
        {typesOfCare.length > 0 ? (
          typesOfCare.map((type, index) => (
            <View key={index} style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 15,
            }}>
              <Text style={{
                fontSize: 16,
                marginRight: 10,
                flex: 1,  // Pour que le texte prenne tout l'espace à gauche
              }}>{type}</Text>
              
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  borderColor: '#ccc',
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => handleCheckboxChange(type)}
              >
                <FontAwesome
                  name={selectedTypes.includes(type) ? 'check' : 'square-o'}
                  size={20}
                  color={selectedTypes.includes(type) ? '#EABBFF' : '#ccc'}
                />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text>Aucun type de garde disponible</Text>
        )}
      </ScrollView>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#98B9F2',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            flex: 1,
            marginRight: 10,
            alignItems: 'center',
          }}
          onPress={closeModal}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Fermer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#EABBFF',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            flex: 1,
            alignItems: 'center',
          }}
          onPress={handleSaveType}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Confirmer</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>




      {/* Modal des enfants */}
      
      <Modal
  animationType="slide"
  transparent={true}
  visible={modalChildrenVisible}
  onRequestClose={handleCloseChildrenModal}
>
  <View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }}>
    <View style={{
      width: '90%',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
    }}>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
      }}>Sélectionner des enfants</Text>

      {/* Formulaire pour ajouter un enfant */}
      <View style={{ marginBottom: 20 }}>
        <TextInput
          style={{
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 10,
            paddingLeft: 10,
          }}
          placeholder={
            user.children && user.children.length > 0
              ? user.children.map(child => child.firstnamechild).join(', ') 
              : 'Aucun enfant ajouté'
          }
          value={newChild.firstname}
          onChangeText={(text) => setNewChild({ ...newChild, firstname: text })}
        />
        <TextInput
          style={{
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 10,
            paddingLeft: 10,
          }}
          placeholder="Nom"
          value={newChild.namechild}
          onChangeText={(text) => setNewChild({ ...newChild, namechild: text })}
        />
        <TextInput
          style={{
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 10,
            paddingLeft: 10,
          }}
          placeholder="Date de naissance"
          value={newChild.birthdate}
          onChangeText={(text) => setNewChild({ ...newChild, birthdate: text })}
        />

        <TouchableOpacity
          style={{
            backgroundColor: '#98B9F2',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            marginBottom: 20,
            alignItems: 'center',
          }}
          onPress={handleAddChild} // Ajouter un enfant
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Ajouter un enfant</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ marginBottom: 20 }}>
        {user.children && user.children.length > 0 ? (
          user.children.map((child, index) => (
            <View key={index} style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 15,
            }}>
              <Text style={{
                fontSize: 16,
                marginRight: 10,
                flex: 1,
              }}>
                {child.firstnamechild} {child.namechild} (Né(e) le : {child.birthdate})
              </Text>

              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  borderColor: '#ccc',
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => handleRemoveChild(child._id)} // Supprimer un enfant
              >
                <FontAwesome name="trash" size={20} color="#EABBFF" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text>Aucun enfant disponible</Text>
        )}
      </ScrollView>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#98B9F2',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            flex: 1,
            marginRight: 10,
            alignItems: 'center',
          }}
          onPress={handleCloseChildrenModal}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Fermer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#EABBFF',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            flex: 1,
            alignItems: 'center',
          }}
          onPress={handleSaveChildren} // Sauvegarder les modifications
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Confirmer</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>



    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  titleContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
    marginHorizontal: 10, // Ajoute une marge horizontale
  },
  title: { fontSize: 24, color: '#fff' },
  container: { 
    padding: 20, 
    marginHorizontal: 10, // Ajoute une marge horizontale
  },
  fieldContainer: { marginBottom: 20 },
  fieldLabel: { fontSize: 16, color: '#fff' },
  fieldBox: { 
    backgroundColor: '#fff', 
    padding: 10, 
    borderRadius: 8, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginHorizontal: 10, // Ajoute une marge horizontale
  },
  fieldValueContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    width: '100%',
  },
  fieldValue: { fontSize: 14, color: '#000' },
  input: { flex: 1, height: 40, fontSize: 14, color: '#000' },
  saveIcon: { marginLeft: 10 },
  errorMessage: { color: 'red', fontSize: 12 },
  editIcon: { 
    marginLeft: 10, 
    position: 'absolute',  
    right: 10, 
    alignSelf: 'flex-end',
  },
  logoutButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10, // Ajoute une marge horizontale
    right: 10, // Ajoute une marge horizontale
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: { backgroundColor: '#f44336', padding: 15, borderRadius: 8 },
  logoutButtonText: { color: '#fff', fontSize: 18 },
  powerIcon: { 
    position: 'absolute', 
    top: 10, 
    right: 10 
  },
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    marginHorizontal: 10, // Ajoute une marge horizontale
  },
  modalContainer: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 8, 
    width: '80%', 
    marginHorizontal: 10, // Ajoute une marge horizontale
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  checkboxContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10, 
    marginHorizontal: 10, // Ajoute une marge horizontale
  },
  checkboxText: { fontSize: 16, marginRight: 10 },
  checkbox: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  saveButton: { 
    backgroundColor: '#28a745', 
    padding: 15, 
    borderRadius: 8, 
    marginTop: 10, 
    marginHorizontal: 10, // Ajoute une marge horizontale
  },
  saveButtonText: { color: '#fff', fontSize: 18, textAlign: 'center' },
  cancelButton: { 
    backgroundColor: '#bbb', 
    padding: 15, 
    borderRadius: 8, 
    marginTop: 10, 
    marginHorizontal: 10, // Ajoute une marge horizontale
  },
  cancelButtonText: { color: '#fff', fontSize: 18, textAlign: 'center' },
  typeEditIcon: {
    position: 'absolute', 
    right: -235, 
    alignSelf: 'flex-end',
    marginHorizontal: 10, // Ajoute une marge horizontale
  },
});



export default ProfileScreen;
