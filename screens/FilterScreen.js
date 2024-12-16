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
import { useDispatch, useSelector } from 'react-redux'; // Import Redux
import { setSearchCriteria } from '../reducers/searchCriteria';

const FilterScreen = ({ navigation, background = require('../assets/background.png') }) => {
  const [selectedMenu, setSelectedMenu] = useState('Ponctuelle');
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalChildrenVisible, setModalChildrenVisible] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [typesOfCare, setTypesOfCare] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);
  const [establishmentsData, setEstablishmentsData] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [children, setChildren] = useState([]); // Liste des enfants initialisée à un tableau vide
  const [selectedChildren, setSelectedChildren] = useState([]); // Enfants sélectionnés

  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.id); // Accéder à l'ID de l'utilisateur connecté

  useEffect(() => {
    if (!selectedCity) {
      fetch('http://192.168.1.154:3000/establishments/city')
        .then(response => response.json())
        .then(data => setCities(data))
        .catch(error => {
          console.error('Erreur lors de la récupération des villes:', error);
          Alert.alert("Erreur", "Impossible de récupérer les villes.");
        });
    }
  }, [selectedCity]);

  const handleSliderClick = () => {
    fetch('http://192.168.1.154:3000/establishments/type')
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

  const handleCheckboxChange = (type) => {
    setSelectedTypes((prevSelectedTypes) => {
      if (prevSelectedTypes.includes(type)) {
        return prevSelectedTypes.filter(t => t !== type);
      } else {
        return [...prevSelectedTypes, type];
      }
    });
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedStartDate('');
    setSelectedEndDate('');
    setSelectedCity('');
    setSelectedDays([]);
    setSelectedChildren([]);
  };

  const handleSave = () => {
    const daysOfWeek = selectedDays.map(date => getDayOfWeek(date));
    const criteria = {
      city: selectedCity,
      days: daysOfWeek.join(', '),
      type: selectedTypes.join(', '),
      children: selectedChildren.join(', '),
    };

    console.log('Critères enregistrés:', criteria);

    dispatch(setSearchCriteria(criteria));
    setModalVisible(false); // Fermer la modale après l'enregistrement
  };

  const handleSubmit = () => {
    // Convertir les dates sélectionnées en jours de la semaine
    const daysOfWeek = selectedDays.map(date => getDayOfWeek(date));
    const criteria = {
      city: selectedCity,
      days: daysOfWeek.join(', '),
      type: selectedTypes.join(', '),
      children: selectedChildren.join(', '),
    };

    console.log('Critères envoyés:', criteria);

    fetch(`http://192.168.1.154:3000/establishments?city=${encodeURIComponent(criteria.city)}&days=${encodeURIComponent(criteria.days)}&type=${encodeURIComponent(criteria.type)}&children=${encodeURIComponent(criteria.children)}`)
      .then(response => response.json())
      .then(data => {
        console.log('Données reçues du backend:', data);

        // Vérifier si des établissements ont été renvoyés
        if (data && data.establishments && Array.isArray(data.establishments)) {
          if (data.establishments.length === 0) {
            // Si aucun établissement n'est trouvé, afficher une alerte
            Alert.alert("Aucun établissement", "Aucun établissement n'est ouvert aux dates sélectionnées.");
          } else {
            // Si des établissements sont trouvés, les afficher sans alerte
            console.log('Établissements disponibles:', data.establishments);
            setEstablishmentsData(data.establishments);
          }
        } else {
          // En cas de données inattendues ou d'erreur
          console.error('Format de données inattendu ou établissements non définis:', data);
          Alert.alert("Erreur", "Format de données inattendu ou établissements non définis.");
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des établissements:', error);
        Alert.alert("Erreur", "Impossible de récupérer les établissements.");
      });

    dispatch(setSearchCriteria(criteria));
    navigation.navigate('Location');
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

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
      markedDates[day] = { selected: true, marked: true, customStyles: { container: { backgroundColor: '#EABBFF' }, text: { color: 'white' } } }; // Mise en surbrillance avec la couleur EABBFF
    });
    return markedDates;
  };

  const handleChildrenFetch = () => {
    fetch(`http://192.168.1.154:3000/users/children?userId=${userId}`)
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(data => {
        console.log('Enfants récupérés :', data);
        setChildren(data || []); // Mettre à jour la liste des enfants
        setModalChildrenVisible(true); // Afficher la modale
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des enfants:', error);
        Alert.alert("Erreur", "Impossible de récupérer les enfants.");
      });
  };

  const handleChildrenCheckboxChange = (childId) => {
    setSelectedChildren((prevSelectedChildren) => {
      if (prevSelectedChildren.includes(childId)) {
        return prevSelectedChildren.filter(id => id !== childId);
      } else {
        return [...prevSelectedChildren, childId];
      }
    });
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
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Sélectionner les types de garde</Text>
              <ScrollView style={{ marginBottom: 20 }}>
                {typesOfCare.map((type) => (
                  <CheckBox
                    key={type}
                    title={<Text>{type}</Text>}
                    checked={selectedTypes.includes(type)}
                    onPress={() => handleCheckboxChange(type)}
                    containerStyle={{ backgroundColor: '#fff', borderWidth: 0 }}
                  />
                ))}
              </ScrollView>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                <TouchableOpacity style={{ flex: 1, padding: 10, backgroundColor: '#98B9F2', borderRadius: 5, marginRight: 10, alignItems: 'center' }} onPress={handleCloseModal}>
                  <Text style={{ fontSize: 18, color: '#fff' }}>Fermer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, padding: 10, backgroundColor: '#EABBFF', borderRadius: 5, alignItems: 'center' }} onPress={handleSave}>
                  <Text style={{ fontSize: 18, color: '#fff' }}>Enregistrer</Text>
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
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Mes enfants</Text>
      <ScrollView style={{ marginBottom: 20 }}>
        {children.map((child) => (
          <CheckBox
            key={child._id} 
            title={<Text>{child.firstnamechild} {child.namechild}</Text>}
            checked={selectedChildren.includes(child._id)}
            onPress={() => handleChildrenCheckboxChange(child._id)}
            containerStyle={{ backgroundColor: '#fff', borderWidth: 0 }}
          />
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
        <TouchableOpacity style={{ flex: 1, padding: 10, backgroundColor: '#98B9F2', borderRadius: 5, marginRight: 10, alignItems: 'center' }} onPress={handleCloseChildrenModal}>
          <Text style={{ fontSize: 18, color: '#fff' }}>Fermer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, padding: 10, backgroundColor: '#EABBFF', borderRadius: 5, alignItems: 'center' }} onPress={handleSave}>
          <Text style={{ fontSize: 18, color: '#fff' }}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>



        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Réinitialiser</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Valider</Text>
          </TouchableOpacity>
        </View>
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

