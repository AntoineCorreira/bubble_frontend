import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ImageBackground, ScrollView, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { updateUser, logout } from '../reducers/user';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [editingField, setEditingField] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const [modalChildrenVisible, setModalChildrenVisible] = useState(false);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [newChild, setNewChild] = useState({ firstname: '', namechild: '', birthdate: '' });

  const nonEditableFields = ['token', '_id', '_v'];

  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const isAtBottom = contentOffsetY >= contentHeight - event.nativeEvent.layoutMeasurement.height;
    setShowLogoutButton(isAtBottom);
  };

  const startEditing = (field, value) => {
    setEditingField(field);
    setInputValue(value);
    setErrorMessage('');
  };

  const saveEdit = (field) => {
    if (inputValue !== '') {
      dispatch(updateUser({ [field]: inputValue }));
      setEditingField(null);
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
    if (selectedChildren.includes(childId)) {
      setSelectedChildren(selectedChildren.filter((id) => id !== childId));
    } else {
      setSelectedChildren([...selectedChildren, childId]);
    }
  };

  const handleSaveChildren = () => {
    console.log('Enfants sélectionnés:', selectedChildren);
    handleCloseChildrenModal();
  };

  const handleAddChild = () => {
    if (newChild.firstname && newChild.namechild && newChild.birthdate) {
      const updatedChildren = [...user.children, newChild];
      dispatch(updateUser({ children: updatedChildren }));
      setNewChild({ firstname: '', namechild: '', birthdate: '' }); // Reset fields
    }
  };

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>
      <View style={styles.overlay}>
        {/* Icône "power" pour une déconnexion rapide en haut */}
        <TouchableOpacity style={styles.powerIcon} onPress={handlePowerLogout}>
          <FontAwesome name="power-off" size={30} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.title}>Profil</Text>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ paddingBottom: 80 }} // Espace pour le bouton en bas
          onScroll={handleScroll} // Écoute de l'événement de scroll
          scrollEventThrottle={400} // Définit la fréquence de mise à jour du scroll
        >
          <View style={styles.container}>
            {Object.keys(user)
              .filter((field) => !nonEditableFields.includes(field))
              .map((field) => (
                <View key={field} style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                  </Text>
                  {editingField === field ? (
                    <>
                      <TextInput
                        style={styles.input}
                        value={inputValue}
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
                      {field !== 'children' && ( // Ajouter l'icône de modification pour tous les champs sauf 'children'
                        <TouchableOpacity
                          style={styles.editIcon}
                          onPress={() => startEditing(field, user[field])}
                        >
                          <FontAwesome name="edit" size={20} color="#000" />
                        </TouchableOpacity>
                      )}
                      {field === 'children' && ( // Afficher le bouton de modification uniquement pour le champ enfants
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
              ))}
          </View>
        </ScrollView>

        {/* Bouton de déconnexion visible uniquement en bas */}
        {showLogoutButton && (
          <View style={styles.logoutButtonContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Se Déconnecter</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modale pour les enfants */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalChildrenVisible}
        onRequestClose={handleCloseChildrenModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Sélectionner un enfant</Text>
            <ScrollView style={{ marginBottom: 20 }}>
              {user.children?.map((child) => (
                <View key={child._id} style={styles.checkboxContainer}>
                  <Text style={styles.checkboxText}>
                    {child.firstname} {child.namechild} (Né(e) le : {child.birthdate})
                  </Text>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => handleChildrenCheckboxChange(child._id)}
                  >
                    <Text style={styles.checkboxLabel}>
                      {selectedChildren.includes(child._id) ? 'Désélectionner' : 'Sélectionner'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <View style={styles.addChildContainer}>
              <TextInput
                style={styles.input}
                value={newChild.firstname}
                onChangeText={(text) => setNewChild({ ...newChild, firstname: text })}
                placeholder="Prénom de l'enfant"
              />
              <TextInput
                style={styles.input}
                value={newChild.namechild}
                onChangeText={(text) => setNewChild({ ...newChild, namechild: text })}
                placeholder="Nom de l'enfant"
              />
              <TextInput
                style={styles.input}
                value={newChild.birthdate}
                onChangeText={(text) => setNewChild({ ...newChild, birthdate: text })}
                placeholder="Date de naissance de l'enfant"
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddChild}>
                <Text style={styles.addButtonText}>Ajouter un enfant</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCloseChildrenModal}
              >
                <Text style={styles.modalButtonText}>Fermer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveChildren}
              >
                <Text style={styles.modalButtonText}>Sauvegarder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  container: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 18,
    color: '#fff',
  },
  fieldValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldValue: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 8,
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  editIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  saveIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  logoutButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  powerIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  checkboxContainer: {
    marginBottom: 10,
  },
  checkboxText: {
    fontSize: 16,
  },
  checkbox: {
    padding: 5,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    marginTop: 5,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#007bff',
  },
  addChildContainer: {
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileScreen;
