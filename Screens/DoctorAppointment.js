import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from 'react-native';
import { firebase } from '../config';

const DoctorAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentUserFullName, setCurrentUserFullName] = useState("");
  const [initializing, setInitializing] = useState(true);
  const todoRef = firebase.firestore().collection('randevu');

  useEffect(() => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      const userRef = firebase.firestore().collection('users').doc(userId);
      userRef.get().then((doc) => {
        if (doc.exists) {
          const { firstName, lastName } = doc.data();
          setCurrentUserFullName(`${firstName} ${lastName}`);
        } else {
          console.log("Kullanıcı verisi bulunamadı.");
        }
      }).catch((error) => {
        console.error("Kullanıcı verisini alma hatası:", error);
      });
    }

    if (initializing) setInitializing(false);
  }, []);

  const deleteAppointment = async (appointmentId) => {
    try {
      await todoRef.doc(appointmentId).delete();
      console.log('Randevu başarıyla silindi.');
    } catch (error) {
      console.error('Randevu silinirken hata oluştu:', error);
    }
  };

  useEffect(() => {
    const unsubscribeSnapshot = todoRef.onSnapshot(
      (querySnapShot) => {
        const filteredAppointments = [];
        querySnapShot.forEach((doc) => {
          const { doktorId, hastane, email, polikinlik, tarih, saat } = doc.data();

          if (currentUserFullName === doktorId) {
            filteredAppointments.push({
              id: doc.id,
              doktorId,
              hastane,
              email,
              polikinlik,
              tarih,
              saat,
              
            });
          }
        });

        setAppointments(filteredAppointments);
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );

    return () => unsubscribeSnapshot();
  }, [currentUserFullName, initializing, todoRef]);

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.itemHeading}>Randevularım</Text>
        <Text style={styles.itemHeading}>Hastane: {item.hastane}</Text>
        <Text style={styles.itemHeading}>Poliklinik: {item.polikinlik}</Text>
        <Text style={styles.itemHeading}>Tarih: {item.tarih}</Text>
                <Text style={styles.itemHeading}>Saat: {item.saat}</Text>
        <Text style={styles.itemHeading}>Hasta bilgisi: {item.email}</Text>
      </View>
      <Pressable
        style={styles.deleteButton}
        onPress={() => handleDeleteAppointment(item.id)}
      >
        <Text style={styles.deleteButtonText}>Sil</Text>
      </Pressable>
    </View>
  );

  const handleDeleteAppointment = (appointmentId) => {
    Alert.alert(
      'Randevu Sil',
      'Randevuyu silmek istediğinizden emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Sil', onPress: () => deleteAppointment(appointmentId) },
      ]
    );
  };


  return (
    <View style={{ flex: 1, marginTop: 100 }}>
      {appointments.length >= 0 ? (
        <FlatList
          style={{ height: '100%' }}
          data={appointments}
          numColumns={1}
          renderItem={renderItem}
        />
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 18 }}>
          Randevunuz bulunmamaktadır.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
  },
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  itemHeading: {
    fontWeight: 'bold',
    color: '#fff',
    alignItems: 'center',
  },
  itemText: {
    fontWeight: '300',
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DoctorAppointment;
