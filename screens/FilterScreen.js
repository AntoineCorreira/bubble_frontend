import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Calendar } from 'react-native-calendars';
import { CheckBox } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchCriteria } from '../reducers/searchCriteria';

// Fonction pour récupérer le jour de la semaine
const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return daysOfWeek[date.getDay()];
};

const FilterScreen = ({ navigation, background = require('../assets/background.png') }) => {
  const userId = useSelector(state => state.user.value._id); // Accéder à l'ID de l'utilisateur connecté
  const dispatch = useDispatch();

  const [selectedMenu, setSelectedMenu] = useState('Ponctuelle');
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalChildrenVisible, setModalChildrenVisible] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [typesOfCare, setTypesOfCare] = useState([]); // Liste des types de garde
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]); // Liste des villes
  const [establishmentsData, setEstablishmentsData] = useState([]); // Liste des établissements
  const [selectedDays, setSelectedDays] = useState([]);
  const [children, setChildren] = useState([]); // Liste des enfants
  const [selectedChildren, setSelectedChildren] = useState([]); // Enfants sélectionnés

  // Récupération des villes
  useEffect(() => {
    if (!selectedCity) {
      fetch('http://192.168.1.129:3000/establishments/city')
        .then(response => response.json())
        .then(data => setCities(data))
        .catch(error => {
          console.error('Erreur lors de la récupération des villes:', error);
          Alert.alert("Erreur", "Impossible de récupérer les villes.");
        });
    }
  }, [selectedCity]);

  // Récupération des types de garde au clic sur l'icône de filtre
  const handleSliderClick = () => {
    fetch('http://192.168.1.129:3000/establishments/type')
      .then(response => response.json())
      .then(data => {
        setTypesOfCare(data);
        setModalVisible(true);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des types de garde:', error);
        Alert.alert("Erreur", "Impossible de récupérer les types de garde.");
      });
  };

  // Gestion de la sélection des types de garde
  const handleCheckboxChange = (type) => {
    setSelectedTypes((prevSelectedTypes) => {
      if (prevSelectedTypes.includes(type)) {
        return prevSelectedTypes.filter(t => t !== type);
      } else {
        return [...prevSelectedTypes, type];
      }
    });
  };

  // Réinitialisation des filtres
  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedStartDate('');
    setSelectedEndDate('');
    setSelectedCity('');
    setSelectedDays([]);
    setSelectedChildren([]);
  };

  // Sauvegarde des critères sélectionnés dans le store
  const handleSave = () => {
    const daysOfWeek = selectedDays.map(date => getDayOfWeek(date));
    const criteria = {
      city: selectedCity,
      days: daysOfWeek.join(', '),
      type: selectedTypes.join(', '),
      children: selectedChildren.join(', '),
    };

    dispatch(setSearchCriteria(criteria));
    setModalVisible(false); // Fermer la modale des types après l'enregistrement
    setModalChildrenVisible(false); // Fermer la modale des enfants après l'enregistrement
  };

  // Soumission du formulaire avec recherche d'établissements
  const handleSubmit = () => {
    // Convertir les dates sélectionnées en jours de la semaine
    const daysOfWeek = selectedDays.map(date => getDayOfWeek(date));
    const criteria = {
      city: selectedCity,
      days: daysOfWeek.join(', '),
      type: selectedTypes.join(', '),
      children: selectedChildren.join(', '),
    };

    fetch(`http://192.168.1.129:3000/establishments?city=${encodeURIComponent(criteria.city)}&days=${encodeURIComponent(criteria.days)}&type=${encodeURIComponent(criteria.type)}&children=${encodeURIComponent(criteria.children)}`)
      .then(response => {
        if (!response.ok) {
          console.error('Erreur dans la réponse:', response);
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(data => {
        if (data && data.establishments && Array.isArray(data.establishments)) {
          if (data.establishments.length === 0) {
            Alert.alert("Aucun établissement", "Aucun établissement n'est ouvert aux dates sélectionnées.");
          } else {
            setEstablishmentsData(data.establishments);
            navigation.navigate('Location'); // Naviguer vers LocationScreen
          }
        } else {
          Alert.alert("Erreur", "Format de données inattendu ou établissements non définis.");
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des établissements:', error);
        Alert.alert("Erreur", "Impossible de récupérer les établissements.");
      });

    dispatch(setSearchCriteria(criteria));
  };

  // Gestion de la sélection des dates
  const handleDateChange = (day) => {
    const dayString = day.dateString;
    setSelectedDays(prevSelectedDays => {
      if (prevSelectedDays.includes(dayString)) {
        return prevSelectedDays.filter(d => d !== dayString);
      } else {
        return [...prevSelectedDays, dayString];
      }
    });
  };

  const getMarkedDates = () => {
    const markedDates = {};
    selectedDays.forEach(day => {
      markedDates[day] = { selected: true, marked: true, customStyles: { container: { backgroundColor: '#EABBFF' }, text: { color: 'white' } } };
    });
    return markedDates;
  };

  // Récupération des enfants
  const handleChildrenFetch = () => {
    fetch(`http://192.168.1.129:3000/users/children?userId=${userId}`)
      .then(response => {
        // Vérifiez le statut de la réponse
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        
        // Vérifiez le type de contenu de la réponse
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json();
        } else {
          return response.text().then(text => { throw new Error(`Réponse non-JSON: ${text}`); });
        }
      })
      .then(data => {
        console.log("Données complètes des enfants reçues:", data);
        if (Array.isArray(data)) {
          console.log('Données enfants au bon format:', data);
          setChildren(data || []);
          setModalChildrenVisible(true);
        } else {
          console.error('Les données des enfants ne sont pas au bon format:', data);
          Alert.alert("Erreur", "Les données des enfants ne sont pas au bon format.");
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des enfants:', error);
        Alert.alert("Erreur", `Impossible de récupérer les enfants: ${error.message}`);
      });
  };
  

  // Sélection des enfants
  const handleChildrenCheckboxChange = (childId) => {
    setSelectedChildren((prevSelectedChildren) => {
      if (prevSelectedChildren.includes(childId)) {
        return prevSelectedChildren.filter(id => id !== childId);
      } else {
        return [...prevSelectedChildren, childId];
      }
    });
  };

  // Fermeture des modales
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleCloseChildrenModal = () => {
    setModalChildrenVisible(false);
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
            onChangeText={setSelectedCity}
          />
          <FontAwesome name="search" style={styles.searchIcon} />
          <TouchableOpacity onPress={handleSliderClick}>
            <FontAwesome name="sliders" style={styles.sliderIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDateChange}
            markingType={'custom'}
            markedDates={getMarkedDates()}
          />
        </View>

        <TouchableOpacity onPress={handleChildrenFetch}>
          <Text style={styles.childrenButtonText}>Récupérer mes enfants</Text>
        </TouchableOpacity>

        {/* Modale pour les types de garde */}
        <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={handleCloseModal}
>
  <View style={{ 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)'
  }}>
    <View style={{ 
      width: '80%', 
      backgroundColor: 'white', 
      borderRadius: 10, 
      padding: 20, 
      alignItems: 'center'
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Sélectionner un type de garde</Text>
      <ScrollView style={{ marginBottom: 20 }}>
        {typesOfCare.map((type) => (
          <CheckBox
            key={type}
            title={<Text>{type}</Text>}
            checked={selectedTypes.includes(type)}
            onPress={() => handleCheckboxChange(type)}
            containerStyle={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} // Style intégré
          />
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#98B9F2', 
            padding: 10, 
            borderRadius: 5, 
            flex: 1, 
            alignItems: 'center', 
            marginRight: 5 
          }} 
          onPress={handleCloseModal}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Fermer</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#EABBFF', 
            padding: 10, 
            borderRadius: 5, 
            flex: 1, 
            alignItems: 'center', 
            marginLeft: 5 
          }} 
          onPress={handleSave}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>





        {/* Modale pour les enfants */}
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
    backgroundColor: 'rgba(0,0,0,0.5)' 
  }}>
    <View style={{ 
      width: '80%', 
      backgroundColor: 'white', 
      borderRadius: 10, 
      padding: 20, 
      alignItems: 'center'
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Sélectionner un enfant</Text>
      <ScrollView style={{ marginBottom: 20 }}>
        {children.map((child) => (
          <CheckBox
            key={child._id}
            title={<Text>{child.firstnamechild} {child.namechild}</Text>}
            checked={selectedChildren.includes(child._id)}
            onPress={() => handleChildrenCheckboxChange(child._id)}
            containerStyle={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} // Style intégré
          />
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#98B9F2', 
            padding: 10, 
            borderRadius: 5, 
            flex: 1, 
            alignItems: 'center', 
            marginRight: 5 
          }} 
          onPress={handleCloseChildrenModal}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Fermer</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#EABBFF', 
            padding: 10, 
            borderRadius: 5, 
            flex: 1, 
            alignItems: 'center', 
            marginLeft: 5 
          }} 
          onPress={handleSave}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>





        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Rechercher</Text>
        </TouchableOpacity>
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    color: 'blue', // Couleur bleue
    textAlign: 'center', // Texte centré
    marginTop: 10, // Marge en haut de 10
  },
  childrenButtonText: {
    color: '#fff',
    backgroundColor: '#EABBFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  childrenList: {
    marginTop: 20,
    maxHeight: 200,
    marginBottom: 20,
  },
  childrenText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
});


export default FilterScreen;