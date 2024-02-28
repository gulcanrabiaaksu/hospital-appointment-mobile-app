import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable ,Alert} from 'react-native';
import { firebase } from '../config';

const Appointment = () => {
  const [users, setUsers] = useState([]);
  const currentUserEmail = firebase.auth().currentUser?.email; // Kullanıcının giriş yaptığı e-posta
  const [loading, setLoading] = useState(true); // Verilerin yüklenip yüklenmediğini kontrol etmek için

  const todoRef = firebase.firestore().collection('randevu');

  useEffect(() => {
    const unsubscribe = todoRef.onSnapshot(
      (querySnapShot) => {
        console.log(querySnapShot); // Veriyi kontrol etmek için
        const filteredUsers = [];
        querySnapShot.forEach((doc) => {
          const { doktorId, hastane, email, polikinlik, tarih, saat } = doc.data();

          if (currentUserEmail === email) {
            filteredUsers.push({
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

        console.log(filteredUsers);
        setUsers(filteredUsers);
        setLoading(false); // Verilerin yüklendiğini belirt

      },
      (error) => {
        console.error('Error fetching appointments:', error);
        setLoading(false); // Hata durumunda da yüklendiğini belirt
      }
    );

    return () => unsubscribe(); // Clean up
  }, [currentUserEmail]);
  const handleDeleteAppointment = (appointmentId) => {
    // Randevu silme işlemi
    firebase.firestore().collection('randevu').doc(appointmentId).delete()
      .then(() => {
        console.log('Randevu başarıyla silindi');
        // Başarı mesajı göster
        Alert.alert(

          'Randevu başarıyla silindi.',
          [
            {
              text: 'Tamam',
              onPress: () => {
                // Home sayfasına yönlendir
                navigation.navigate('Home');
              },
            },
          ],
          { cancelable: false }
        );
      })
      .catch((error) => {
        //onsole.error('Randevu silinirken hata oluştu:', error);
        // Hata mesajı göster
        //Alert.alert('Hata', 'Randevu silinirken bir hata oluştu.');
      });
  };
  return (
    <View style={{ flex: 1, marginTop: 100 }}>
      {loading ? (
        <Text style={styles.loadingText}>Randevular yükleniyor...</Text>
      ) : users.length === 0 ? (
        <Text style={styles.noAppointmentText}>Henüz bir randevunuz bulunmamaktadır.</Text>
      ) : (
        <FlatList
          style={{ height: '100%' }}
          data={users}
          numColumns={1}
          renderItem={({ item }) => (
            <Pressable style={styles.container}>
              <View style={styles.innerContainer}>
                <Text style={styles.itemHeading}>Doktor: {item.doktorId}</Text>
                <Text style={styles.itemHeading}>Hastane: {item.hastane}</Text>
                <Text style={styles.itemHeading}>Poliklinik: {item.polikinlik}</Text>
                <Text style={styles.itemHeading}>Tarih: {item.tarih}</Text>
                <Text style={styles.itemHeading}>Saat: {item.saat}</Text>
                <Text style={styles.itemHeading}>Hasta e-mail: {item.email}</Text>
              {/* Randevu Güncelle butonu */}
              <Pressable
                  style={styles.updateButton}
                  onPress={() => {
                    // Ekrana olumsuz yanıt mesajını göster
                    Alert.alert(
                      'Randevuyu Sil',
                      'Randevunuzu silmek istediğinize emin misiniz?',
                      [
                        {
                          text: 'Vazgeç',
                          style: 'cancel',
                        },
                        {
                          text: 'Sil',
                          onPress: () => {
                            handleDeleteAppointment(item.id);
                          },
                        },
                      ],
                      { cancelable: true }
                    );
                  }}
                >
                  <Text style={styles.updateButtonText}>Randevumu Sil</Text>
                </Pressable>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
};

export default Appointment;

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
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  noAppointmentText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
});
