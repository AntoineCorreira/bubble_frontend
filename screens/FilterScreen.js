import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, TextInput, Modal, ScrollView, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { setSearchCriteria } from '../reducers/searchCriteria';

const FilterScreen = ({ navigation, background = require('../assets/background.png') }) => {
  const [selectedMenu, setSelectedMenu] = useState('Ponctuelle');
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [childrenModalVisible, setChildrenModalVisible] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [childrenItems, setChildrenItems] = useState([]);
  const [childrenPlaceholder, setChildrenPlaceholder] = useState('Nom de votre enfant');
  const [typesOfCare, setTypesOfCare] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);
  const [periods, setPeriods] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    fetch('http://192.168.1.154:3000/establishments/type')
      .then(response => response.json())
      .then(data => {
        console.log('Types de garde récupérés:', data);
        setTypesOfCare(data);
      })
      .catch(error => {
        console.error('Error fetching types of care:', error);
      });
  
    if (selectedCity) {
      fetch(`http://192.168.1.154:3000/establishments?city=${encodeURIComponent(selectedCity)}`)
        .then(response => response.json())
        .then(data => {
          console.log('Établissements récupérés:', data);
          setCities(data); // Assurez-vous que vous définissez setCities
        })
        .catch(error => {
          console.error('Error fetching establishments:', error);
        });
    }
  
    fetch('http://192.168.1.154:3000/establishments/period')
      .then(response => response.json())
      .then(data => {
        console.log('Périodes récupérées:', data);
        setPeriods(data);
      })
      .catch(error => {
        console.error('Error fetching periods:', error);
      });
  
    fetch('http://192.168.1.154:3000/users/children')
      .then(response => response.json())
      .then(data => {
        console.log('Noms des enfants récupérés:', data);
        setChildrenItems(data.children);
      })
      .catch(error => {
        console.error('Error fetching children names:', error);
      });
  }, [selectedCity]);
  
 
  useEffect(() => {
    if (selectedChildren.length === 0) {
      setChildrenPlaceholder('Nom de votre enfant');
    } else {
      const selectedNames = selectedChildren.map(child => child.name).join(', ');
      if (selectedNames.length > 20) {
        setChildrenPlaceholder(`${selectedNames.substring(0, 17)}...`);
      } else {
        setChildrenPlaceholder(selectedNames);
      }
    }
  }, [selectedChildren]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleChildrenModal = () => {
    setChildrenModalVisible(!childrenModalVisible);
  };

  const handleCheckboxChange = (child) => {
    setSelectedChildren(prevSelectedChildren => {
      if (prevSelectedChildren.some(selected => selected.id === child.id)) {
        return prevSelectedChildren.filter(selected => selected.id !== child.id);
      } else {
        return [...prevSelectedChildren, child];
      }
    });
  };

  const handleDateChange = (day) => {
    if (selectedStartDate && !selectedEndDate) {
      setSelectedEndDate(day.dateString);
    } else {
      setSelectedStartDate(day.dateString);
      setSelectedEndDate('');
    }
  };

  const handleStartTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || startTime;
    setShowStartTimePicker(false);
    setStartTime(currentDate);
  };

  const handleEndTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || endTime;
    setShowEndTimePicker(false);
    setEndTime(currentDate);
  };

  const getMarkedDates = () => {
    let markedDates = {};
    if (selectedStartDate) {
      markedDates[selectedStartDate] = { selected: true, startingDay: true, color: 'green' };
    }
    if (selectedEndDate) {
      markedDates[selectedEndDate] = { selected: true, endingDay: true, color: 'green' };
      let start = new Date(selectedStartDate);
      let end = new Date(selectedEndDate);
      while (start < end) {
        start.setDate(start.getDate() + 1);
        const dateString = start.toISOString().split('T')[0];
        if (dateString !== selectedEndDate) {
          markedDates[dateString] = { selected: true, color: 'lightgreen' };
        }
      }
    }
    return markedDates;
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedStartDate('');
    setSelectedEndDate('');
    setStartTime(new Date());
    setEndTime(new Date());
    setSelectedChildren([]);
    setSearch('');
    setSelectedCity('');
  };

  const handleSubmit = () => {
    console.log('Critères envoyés:', {
      city: selectedCity, // Utilisation de la ville sélectionnée
      period: selectedStartDate + ' - ' + selectedEndDate,
      type: selectedTypes.join(', '),
    });

    dispatch(setSearchCriteria({
      city: selectedCity, // Utilisation de la ville sélectionnée
      period: selectedStartDate + ' - ' + selectedEndDate,
      type: selectedTypes.join(', '),
    }));
    navigation.navigate('Location');
  };

  

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
  value={selectedCity}
  onChangeText={(value) => setSelectedCity(value)}
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
  
        <View style={styles.timePickerContainer}>
          <TouchableOpacity style={styles.timeButton} onPress={() => setShowStartTimePicker(true)}>
            <Text style={styles.timeButtonText}>Heure de début: {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
        
          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display="default"
              onChange={handleStartTimeChange}
              is24Hour={true}
            />
          )}
  
          <TouchableOpacity style={styles.timeButton} onPress={() => setShowEndTimePicker(true)}>
            <Text style={styles.timeButtonText}>Heure de fin: {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
  
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
  
        <View style={styles.pickerContainer}>
          <TouchableOpacity style={styles.pickerButton} onPress={toggleChildrenModal}>
            <Text style={styles.pickerButtonText}>{childrenPlaceholder}</Text>
            <FontAwesome name="caret-down" style={styles.pickerIcon} />
          </TouchableOpacity>
        </View>
  
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Réinitialiser</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Valider</Text>
          </TouchableOpacity>
        </View>
  
  
  
  
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

