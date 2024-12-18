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

// Définir la fonction getDayOfWeek
const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return daysOfWeek[date.getDay()];
};

const ObligatoryFilterScreen = ({ navigation, background = require('../assets/background.png') }) => {
  const userId = useSelector(state => state.user.id); // Accéder à l'ID de l'utilisateur connecté
  const dispatch = useDispatch();

  const [selectedDays, setSelectedDays] = useState([]);
  const [modalChildrenVisible, setModalChildrenVisible] = useState(false);
  const [children, setChildren] = useState([]);
  const [selectedChildren, setSelectedChildren] = useState([]);

  const handleSubmit = () => {
    // Convertir les dates sélectionnées en jours de la semaine
    const daysOfWeek = selectedDays.map(date => getDayOfWeek(date));
    const criteria = {
      days: daysOfWeek.join(', '),
      children: selectedChildren.join(', '),
    };

    console.log('Critères envoyés:', criteria);
    dispatch(setSearchCriteria(criteria));
    navigation.navigate('Location');
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
      markedDates[day] = { selected: true, marked: true, customStyles: { container: { backgroundColor: '#EABBFF' }, text: { color: 'white' } } };
    });
    return markedDates;
  };

  const handleChildrenFetch = () => {
    fetch(`http://192.168.1.129:3000/children?userId=${userId}`)
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(data => {
        console.log('Enfants récupérés :', data);
        setChildren(data || []);
        setModalChildrenVisible(true);
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
                <TouchableOpacity style={{ flex: 1, padding: 10, backgroundColor: '#EABBFF', borderRadius: 5, alignItems: 'center' }} onPress={handleSubmit}>
                  <Text style={{ fontSize: 18, color: '#fff' }}>Enregistrer</Text>
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
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  calendarContainer: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
  },
  childrenButtonText: {
    fontSize: 16,
    color: '#333',
    textDecorationLine: 'underline',
    marginTop: 20,
    textAlign: 'center',
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
  },
});

export default ObligatoryFilterScreen;
