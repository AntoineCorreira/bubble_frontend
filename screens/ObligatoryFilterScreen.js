import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Calendar } from 'react-native-calendars';
import { CheckBox } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchCriteria, resetSearchCriteria } from '../reducers/searchCriteria';

const serveurIP = process.env.EXPO_PUBLIC_SERVEUR_IP;

// Fonction pour obtenir le jour de la semaine à partir d'une date
const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return daysOfWeek[date.getDay()];
};

// Fonction pour vérifier si l'établissement est ouvert ou fermé à une date donnée
const isOpenOnDay = (schedules, dateString) => {
  const dayOfWeek = getDayOfWeek(dateString); // Récupérer le jour de la semaine
  const scheduleForDay = schedules.find(schedule => schedule.day === dayOfWeek);

  return scheduleForDay ? 'Ouvert' : 'Fermé';
};

const ObligatoryFilterScreen = ({ navigation, background = require('../assets/background.png') }) => {
  const user = useSelector(state => state.user.value);
  const searchCriteria = useSelector((state) => state.searchCriteria);
  const establishment = useSelector((state) => state.establishment.value)
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [children, setChildren] = useState([]);
  const [modalChildrenVisible, setModalChildrenVisible] = useState(false);
  const [criteria, setCriteria] = useState({ startDate: null, endDate: null, children: [] });

  const establishmentSchedules = useSelector(state => state.establishment.value.schedules); // Récupérer les horaires de l'établissement

  // useEffect pour charger les horaires au moment du montage du composant
  useEffect(() => {
    // Ici, on peut charger les horaires de l'établissement, si ce n'est pas déjà fait
    console.log('Horaires de l\'établissement chargés:', establishmentSchedules);
  }, [establishmentSchedules]); // Rechargé si les horaires changent

  // useEffect pour vérifier les dates sélectionnées et afficher une alerte si l'établissement est fermé
  useEffect(() => {
    if (startDate && endDate) {
      const startStatus = isOpenOnDay(establishmentSchedules, startDate);
      const endStatus = isOpenOnDay(establishmentSchedules, endDate);

      // L'alerte s'affiche si l'établissement est fermé pour l'une des dates sélectionnées
      if (startStatus === 'Fermé' || endStatus === 'Fermé') {
        Alert.alert(`État de l'établissement`, `L'établissement est fermé le ${startStatus === 'Fermé' ? startDate : endDate}`);
      }
    }
  }, [startDate, endDate, establishmentSchedules]); // Cette fonction se déclenche à chaque changement de startDate, endDate ou horaires de l'établissement

  const handleSubmit = async () => {
    if (!startDate || !endDate || criteria.children.length === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner toutes les informations nécessaires.");
      return;
    }
  
    const finalCriteria = {
      startDate,
      endDate,
      children: criteria.children,
    };
  
    dispatch(setSearchCriteria(finalCriteria));
  
    const reservationData = {
      startDate: finalCriteria.startDate,
      endDate: finalCriteria.endDate,
      parentFirstname: user.firstname,
      parentName: user.name,
      child: finalCriteria.children,
      establishmentName: establishment.name,
      establishmentZip: establishment.zip,
      status: 'pending',
    };

    console.log('reservationData:', reservationData)
  
    try {
      // Enregistrement de la réservation en base
      const response = await fetch(`http://${serveurIP}:3000/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
      });
  
      // Analyse de la réponse
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        navigation.navigate('Validation'); // Navigation en cas de succès
        dispatch(resetSearchCriteria());
      } else {
        console.error('Erreur côté serveur:', data.message);
        alert(`Erreur : ${data.message}`); // Affiche une alerte en cas d'erreur serveur
      }
    } catch (error) {
      // Gestion des erreurs réseau
      console.error('Erreur réseau :', error);
      alert('Une erreur réseau est survenue. Veuillez réessayer.');
    }
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedChildren([]);
    setCriteria({ startDate: null, endDate: null, children: [] });
    dispatch(resetSearchCriteria());
  };

  const handleDateChange = (day) => {
    const selectedDate = day.dateString;

    if (!startDate) {
      setStartDate(selectedDate);
      setEndDate(null);
    } else if (!endDate && selectedDate > startDate) {
      setEndDate(selectedDate);
    } else {
      setStartDate(selectedDate);
      setEndDate(null);
    }
  };

  const getMarkedDates = () => {
    const markedDates = {};

    if (startDate && endDate) {
      const currentDate = new Date(startDate);
      const end = new Date(endDate);

      while (currentDate <= end) {
        const dateString = currentDate.toISOString().split('T')[0];
        markedDates[dateString] = {
          selected: true,
          marked: true,
          customStyles: { container: { backgroundColor: '#EABBFF' }, text: { color: 'white' } }
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return markedDates;
  };

  const handleChildrenFetch = () => {
    fetch(`http://${serveurIP}:3000/users/children?userId=${user._id}`)
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(data => {
        setChildren(data || []);
        setModalChildrenVisible(true);
      })
      .catch(error => {
        Alert.alert("Erreur", "Impossible de récupérer les enfants.");
      });
  };

  const handleChildrenCheckboxChange = (childId) => {
    setSelectedChildren(prevSelectedChildren => {
      if (prevSelectedChildren.includes(childId)) {
        return prevSelectedChildren.filter(id => id !== childId);
      } else {
        return [...prevSelectedChildren, childId];
      }
    });
  };

  const handleSaveChildren = () => {
    setCriteria(prevCriteria => ({
      ...prevCriteria,
      children: selectedChildren,
    }));
    setModalChildrenVisible(false);
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <FontAwesome5 style={styles.return} name="times" size={30} color="#FFFFFF" onPress={() => { navigation.navigate('Establishment') }} />
      <View style={styles.contentContainer}>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDateChange}
            markingType={'custom'}
            markedDates={getMarkedDates()}
          />
        </View>

        <TouchableOpacity style={styles.fetchChildrenButton} onPress={handleChildrenFetch}>
          <Text style={styles.fetchChildrenButtonText}>Choisir mes enfants</Text>
        </TouchableOpacity>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Début : {startDate ? startDate : 'Aucune sélection'}</Text>
          <Text style={styles.dateText}>Fin : {endDate ? endDate : 'Aucune sélection'}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Réinitialiser</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        </View>

        {/* Modale pour les enfants */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalChildrenVisible}
          onRequestClose={() => setModalChildrenVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Mes enfants</Text>
              <ScrollView style={styles.modalScrollView}>
                {children.map((child) => (
                  <CheckBox
                    key={child._id}
                    title={<Text>{child.firstnamechild} {child.namechild}</Text>}
                    checked={selectedChildren.includes(child._id)}
                    onPress={() => handleChildrenCheckboxChange(child._id)}
                    containerStyle={styles.checkboxContainer}
                  />
                ))}
              </ScrollView>
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalChildrenVisible(false)}>
                  <Text style={styles.modalButtonText}>Fermer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleSaveChildren}>
                  <Text style={styles.modalButtonText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  return: {
    position: 'absolute',
    top: 40, // Ajuste la distance par rapport au haut de l'écran
    left: 20, // Ajuste la distance par rapport au bord gauche
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
  },
  dateContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginVertical: 5,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#EABBFF',
    borderRadius: 5,
    alignItems: 'center',
    width: '45%', // Ajusté pour éviter le dépassement
    height: 51,
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 600,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalScrollView: {
    marginBottom: 20,
    width: '100%',
  },
  checkboxContainer: {
    backgroundColor: '#fff',
    borderWidth: 0,
    marginVertical: 5,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#EABBFF',
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  modalCloseButton: {
    padding: 10,
    backgroundColor: '#98B9F2',
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  fetchChildrenButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    width: '100%', // Ajusté pour éviter le dépassement
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5, // Ombre pour rendre le bouton plus cliquable
  },
  fetchChildrenButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 400, // Texte en gras pour plus de clarté
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'transparent',
    borderRadius: 5,
    alignItems: 'center',
    width: '45%', // Ajusté pour éviter le dépassement
    height: 44,
    borderWidth: 0,
  },
  resetButtonText: {
    fontSize: 20,
    fontWeight: 600,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  }
});

export default ObligatoryFilterScreen;
