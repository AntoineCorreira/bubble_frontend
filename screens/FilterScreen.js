// Importation des modules nécessaires depuis React et React Native
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, TextInput, Modal, ScrollView, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';

// Définition du composant FilterScreen avec une image d'arrière-plan
const FilterScreen = ({ background = require('../assets/background.png') }) => {
  // Déclaration des états avec useState
  const [selectedMenu, setSelectedMenu] = useState('Ponctuelle'); // Menu sélectionné (Ponctuelle ou Régulier)
  const [search, setSearch] = useState(''); // Texte de recherche
  const [modalVisible, setModalVisible] = useState(false); // Visibilité de la modale des types de garde
  const [childrenModalVisible, setChildrenModalVisible] = useState(false); // Visibilité de la modale des enfants
  const [selectedTypes, setSelectedTypes] = useState([]); // Types de soins sélectionnés
  const [selectedStartDate, setSelectedStartDate] = useState(''); // Date de début sélectionnée
  const [selectedEndDate, setSelectedEndDate] = useState(''); // Date de fin sélectionnée
  const [startTime, setStartTime] = useState(new Date()); // Heure de début sélectionnée
  const [endTime, setEndTime] = useState(new Date()); // Heure de fin sélectionnée
  const [showStartTimePicker, setShowStartTimePicker] = useState(false); // Affichage du sélecteur d'heure de début
  const [showEndTimePicker, setShowEndTimePicker] = useState(false); // Affichage du sélecteur d'heure de fin
  const [selectedChildren, setSelectedChildren] = useState([]); // Enfants sélectionnés
  const [childrenItems, setChildrenItems] = useState([ // Liste des enfants disponibles
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
    { id: '4', name: 'Daisy' },
  ]);
  const [childrenPlaceholder, setChildrenPlaceholder] = useState('Nom de votre enfant'); // Placeholder pour le champ des enfants


  // Mise à jour du placeholder en fonction des enfants sélectionnés
useEffect(() => {
  if (selectedChildren.length === 0) {
    setChildrenPlaceholder('Nom de votre enfant'); // Si aucun enfant n'est sélectionné, afficher le placeholder par défaut
  } else {
    const selectedNames = selectedChildren.map(child => child.name).join(', '); // Récupérer les noms des enfants sélectionnés
    if (selectedNames.length > 20) {
      setChildrenPlaceholder(`${selectedNames.substring(0, 17)}...`); // Si les noms sont trop longs, les tronquer
    } else {
      setChildrenPlaceholder(selectedNames); // Sinon, afficher les noms complets
    }
  }
}, [selectedChildren]); // Exécuter ce code à chaque fois que la liste des enfants sélectionnés change

// Fonction pour basculer la visibilité de la modale des types de garde
const toggleModal = () => {
  setModalVisible(!modalVisible);
};

// Fonction pour basculer la visibilité de la modale des enfants
const toggleChildrenModal = () => {
  setChildrenModalVisible(!childrenModalVisible);
};

// Fonction pour gérer les changements de sélection des enfants
const handleCheckboxChange = (child) => {
  setSelectedChildren(prevSelectedChildren => {
    if (prevSelectedChildren.some(selected => selected.id === child.id)) {
      // Si l'enfant est déjà sélectionné, le retirer de la liste
      return prevSelectedChildren.filter(selected => selected.id !== child.id);
    } else {
      // Sinon, ajouter l'enfant à la liste
      return [...prevSelectedChildren, child];
    }
  });
};

// Fonction pour gérer le changement de date sélectionnée
const handleDateChange = (day) => {
  if (selectedStartDate && !selectedEndDate) {
    setSelectedEndDate(day.dateString); // Si une date de début est déjà sélectionnée, définir la date de fin
  } else {
    setSelectedStartDate(day.dateString); // Sinon, définir la date de début
    setSelectedEndDate(''); // Réinitialiser la date de fin
  }
};

// Fonction pour gérer le changement d'heure de début
const handleStartTimeChange = (event, selectedDate) => {
  const currentDate = selectedDate || startTime;
  setShowStartTimePicker(false); // Masquer le sélecteur d'heure de début
  setStartTime(currentDate); // Définir l'heure de début sélectionnée
};

// Fonction pour gérer le changement d'heure de fin
const handleEndTimeChange = (event, selectedDate) => {
  const currentDate = selectedDate || endTime;
  setShowEndTimePicker(false); // Masquer le sélecteur d'heure de fin
  setEndTime(currentDate); // Définir l'heure de fin sélectionnée
};

// Fonction pour obtenir les dates marquées sur le calendrier
const getMarkedDates = () => {
  let markedDates = {};
  if (selectedStartDate) {
    markedDates[selectedStartDate] = {selected: true, startingDay: true, color: 'green'}; // Marquer la date de début en vert
  }
  if (selectedEndDate) {
    markedDates[selectedEndDate] = {selected: true, endingDay: true, color: 'green'}; // Marquer la date de fin en vert
    let start = new Date(selectedStartDate); // Débuter la boucle de dates à partir de la date de début sélectionnée
    let end = new Date(selectedEndDate); // Fin de la boucle de dates à la date de fin sélectionnée
    while (start < end) {
      start.setDate(start.getDate() + 1); // Avancer d'un jour
      const dateString = start.toISOString().split('T')[0]; // Convertir la date en chaîne ISO et récupérer la partie date
      if (dateString !== selectedEndDate) {
        markedDates[dateString] = {selected: true, color: 'lightgreen'}; // Marquer les dates intermédiaires en vert clair
      }
    }
  }
  return markedDates; // Retourner les dates marquées
};

// Fonction pour réinitialiser tous les filtres et les états sélectionnés
const handleReset = () => {
  setSelectedTypes([]); // Réinitialiser les types de garde sélectionnés
  setSelectedStartDate(''); // Réinitialiser la date de début
  setSelectedEndDate(''); // Réinitialiser la date de fin
  setStartTime(new Date()); // Réinitialiser l'heure de début
  setEndTime(new Date()); // Réinitialiser l'heure de fin
  setSelectedChildren([]); // Réinitialiser les enfants sélectionnés
  setSearch(''); // Réinitialiser le texte de recherche
};

// Liste des types de garde disponibles
const typesOfCare = [
  'Crèches', 
  'Assistant(e) maternelle', 
  'Babysitter', 
  'Garde à domicile', 
];

return (
  <ImageBackground source={background} style={styles.background}>
    <View style={styles.contentContainer}>
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setSelectedMenu('Ponctuelle')}
        >
          <Text style={styles.menuText}>Ponctuelle</Text>
          {selectedMenu === 'Ponctuelle' && <View style={styles.menuIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setSelectedMenu('Régulier')}
        >
          <Text style={styles.menuText}>Régulier</Text>
          {selectedMenu === 'Régulier' && <View style={styles.menuIndicator} />}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Localisation"
          placeholderTextColor="#ccc"
          value={search}
          onChangeText={setSearch}
        />
        <FontAwesome name="search" style={styles.searchIcon} />
        <TouchableOpacity onPress={toggleModal}>
          <FontAwesome name="sliders" style={styles.sliderIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDateChange}
          markingType={'period'}
          markedDates={getMarkedDates()}
        />
      </View>

      // Conteneur pour les sélecteurs d'heure (début et fin)
<View style={styles.timePickerContainer}>
  // Bouton pour afficher le sélecteur d'heure de début
  <TouchableOpacity style={styles.timeButton} onPress={() => setShowStartTimePicker(true)}>
    <Text style={styles.timeButtonText}>Heure de début: {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
  </TouchableOpacity>
  // Afficher le sélecteur d'heure de début si showStartTimePicker est vrai
  {showStartTimePicker && (
    <DateTimePicker
      value={startTime}
      mode="time"
      display="default"
      onChange={handleStartTimeChange}
      is24Hour={true}
    />
  )}

  // Bouton pour afficher le sélecteur d'heure de fin
  <TouchableOpacity style={styles.timeButton} onPress={() => setShowEndTimePicker(true)}>
    <Text style={styles.timeButtonText}>Heure de fin: {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
  </TouchableOpacity>
  // Afficher le sélecteur d'heure de fin si showEndTimePicker est vrai
  {showEndTimePicker && (
    <DateTimePicker
      value={endTime}
      mode="time"
      display="default"
      onChange={handleEndTimeChange}
      is24Hour={true}
    />
  )}
</View>

// Conteneur pour le sélecteur des enfants
<View style={styles.pickerContainer}>
  <TouchableOpacity style={styles.pickerButton} onPress={toggleChildrenModal}>
    <Text style={styles.pickerButtonText}>{childrenPlaceholder}</Text>
    <FontAwesome name="caret-down" style={styles.pickerIcon} />
  </TouchableOpacity>
</View>

// Conteneur pour les boutons Réinitialiser et Valider
<View style={styles.buttonContainer}>
  <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
    <Text style={styles.resetButtonText}>Réinitialiser</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.submitButton}>
    <Text style={styles.submitButtonText}>Valider</Text>
  </TouchableOpacity>
</View>

// Première modale : Sélection des enfants
<Modal
  animationType="slide"
  transparent={true}
  visible={childrenModalVisible}
  onRequestClose={toggleChildrenModal}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <ScrollView>
        {childrenItems.map((child) => (
          <CheckBox
            key={child.id}
            title={child.name}
            checked={selectedChildren.some(selected => selected.id === child.id)}
            onPress={() => handleCheckboxChange(child)}
          />
        ))}
      </ScrollView>
      <TouchableOpacity onPress={toggleChildrenModal}>
        <Text style={styles.closeButton}>Confirmer</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

// Deuxième modale : Sélection des types de garde
<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={toggleModal}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <ScrollView>
        {typesOfCare.map((type, index) => (
          <CheckBox
            key={index}
            title={type}
            checked={selectedTypes.includes(type)}
            onPress={() => setSelectedTypes(prevSelectedTypes => {
              if (prevSelectedTypes.includes(type)) {
                return prevSelectedTypes.filter(item => item !== type); // Retirer le type s'il est déjà sélectionné
              } else {
                return [...prevSelectedTypes, type]; // Ajouter le type s'il n'est pas encore sélectionné
              }
            })}
          />
        ))}
      </ScrollView>
      <TouchableOpacity onPress={toggleModal}>
        <Text style={styles.closeButton}>Confirmer</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1, // Prend tout l'espace disponible
  },
  container: {
    flex: 1, // Prend tout l'espace disponible
    justifyContent: 'center', // Centrer verticalement
    alignItems: 'center', // Centrer horizontalement
    marginHorizontal: 20, // Marge horizontale de 20
  },
  contentContainer: {
    flex: 1, // Prend tout l'espace disponible
    justifyContent: 'center', // Centrer verticalement
    alignItems: 'center', // Centrer horizontalement
    width: '90%', // Largeur de 90%
    marginHorizontal: 20, // Marge horizontale de 20
  },
  menuContainer: {
    flexDirection: 'row', // Aligner les éléments en ligne
    justifyContent: 'center', // Centrer horizontalement
    marginTop: 50, // Marge en haut de 50
    position: 'absolute', // Position absolue
    top: 0, // Position en haut de la page
  },
  menuButton: {
    marginHorizontal: 20, // Marge horizontale de 20
    alignItems: 'center', // Centrer horizontalement
  },
  menuText: {
    fontSize: 18, // Taille de police de 18
    color: '#fff', // Couleur blanche
  },
  menuIndicator: {
    marginTop: 5, // Marge en haut de 5
    height: 2, // Hauteur de 2
    width: '100%', // Largeur de 100%
    backgroundColor: '#fff', // Couleur de fond blanche
  },
  searchContainer: {
    flexDirection: 'row', // Aligner les éléments en ligne
    alignItems: 'center', // Centrer horizontalement
    backgroundColor: '#fff', // Couleur de fond blanche
    borderRadius: 10, // Bordure arrondie de 10
    height: 51, // Hauteur de 51
    width: '100%', // Largeur de 100%
    marginTop: 90, // Marge en haut de 90 (pour centrer la barre de recherche)
    paddingLeft: 15, // Padding à gauche de 15
    paddingRight: 15, // Padding à droite de 15
  },
  searchIcon: {
    fontSize: 20, // Taille de police de 20
    color: '#ccc', // Couleur grise
    marginLeft: 10, // Marge à gauche de 10
  },
  sliderIcon: {
    fontSize: 20, // Taille de police de 20
    color: '#ccc', // Couleur grise
    marginLeft: 10, // Marge à gauche de 10
  },
  searchInput: {
    flex: 1, // Prend tout l'espace disponible
    color: '#333', // Couleur grise foncée
  },
  calendarContainer: {
    marginTop: 20, // Marge en haut de 20
    borderRadius: 10, // Bordure arrondie de 10
    overflow: 'hidden', // Masquer le débordement
    width: '100%', // Largeur de 100%
  },
  timePickerContainer: {
    flexDirection: 'row', // Aligner les éléments en ligne
    justifyContent: 'space-between', // Espacement égal entre les éléments
    width: '100%', // Largeur de 100%
    marginTop: 20, // Marge en haut de 20
  },
  timeButton: {
    width: '48%', // Largeur de 48%
    height: 37, // Hauteur de 37
    borderRadius: 10, // Bordure arrondie de 10
    backgroundColor: '#EABBFF', // Couleur de fond violet clair
    justifyContent: 'center', // Centrer verticalement
    alignItems: 'center', // Centrer horizontalement
  },
  timeButtonText: {
    color: '#333', // Couleur grise foncée
    fontSize: 16, // Taille de police de 16
  },
  pickerContainer: {
    marginTop: 20, // Marge en haut de 20
    width: '100%', // Largeur de 100%
    height: 51, // Hauteur de 51
    backgroundColor: '#fff', // Couleur de fond blanche
    borderRadius: 10, // Bordure arrondie de 10
    overflow: 'hidden', // Masquer le débordement
    justifyContent: 'center', // Centrer verticalement
  },
  pickerButton: {
    flexDirection: 'row', // Aligner les éléments en ligne
    alignItems: 'center', // Centrer horizontalement
    justifyContent: 'space-between', // Espacement égal entre les éléments
    paddingHorizontal: 15, // Padding horizontal de 15
    height: 51, // Hauteur de 51
    backgroundColor: '#f0f0f0', // Couleur de fond gris clair
    borderRadius: 10, // Bordure arrondie de 10
    borderColor: '#ccc', // Couleur de la bordure grise
    borderWidth: 1, // Largeur de la bordure de 1
  },
  pickerButtonText: {
    flex: 1, // Prend tout l'espace disponible
    color: '#333', // Couleur grise foncée
  },
  pickerIcon: {
    fontSize: 20, // Taille de police de 20
    color: '#ccc', // Couleur grise
  },
  buttonContainer: {
    flexDirection: 'row', // Aligner les éléments en ligne
    justifyContent: 'space-between', // Espacement égal entre les éléments
    width: '100%', // Largeur de 100%
    marginTop: 20, // Marge en haut de 20
  },
  resetButton: {
    width: '48%', // Largeur de 48%
    height: 51, // Hauteur de 51
    justifyContent: 'center', // Centrer verticalement
    alignItems: 'center', // Centrer horizontalement
    backgroundColor: 'transparent', // Couleur de fond transparente
    borderRadius: 10, // Bordure arrondie de 10
  },
  resetButtonText: {
    color: 'black', // Couleur noire
    fontSize: 18, // Taille de police de 18
    textDecorationLine: 'underline', // Texte souligné
  },
  submitButton: {
    width: '48%', // Largeur de 48%
    height: 51, // Hauteur de 51
    borderRadius: 10, // Bordure arrondie de 10
    backgroundColor: '#EABBFF', // Couleur de fond violet clair
    justifyContent: 'center', // Centrer verticalement
    alignItems: 'center', // Centrer horizontalement
    borderColor: 'white', // Couleur de la bordure blanche
    borderWidth: 1, // Largeur de la bordure de 1
  },
  submitButtonText: {
    color: '#fff', // Couleur blanche
    fontSize: 18, // Taille de police de 18
  },
  modalOverlay: {
    flex: 1, // Prend tout l'espace disponible
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Couleur de fond noire avec transparence
    justifyContent: 'center', // Centrer verticalement
    alignItems: 'center', // Centrer horizontalement
  },
  modalContainer: {
    backgroundColor: '#fff', // Couleur de fond blanche
    padding: 20, // Padding de 20
    borderRadius: 10, // Bordure arrondie de 10
    width: '80%', // Largeur de 80%
  },
  closeButton: {
    color: 'blue', // Couleur bleue
    textAlign: 'center', // Texte centré
    marginTop: 10, // Marge en haut de 10
  },
});

export default FilterScreen;

