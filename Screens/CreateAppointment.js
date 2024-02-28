import React, { useState } from 'react';
import { Dimensions, View, Text, TextInput, Pressable, Alert, Button, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { firebase } from '../config';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const buttonWidth = WIDTH * 0.8;

const CreateAppointment = () => {
  const [selectedHospital, setSelectedHospital] = useState('');
  const [patientName, setPatientName] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const todoRef = firebase.firestore().collection('randevu');

  const weekdays = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];

  const hospitals = [
    { id: 1, name: 'Sakarya Eğitim Araştırma Hastanesi' },
    { id: 2, name: 'Serdivan Devlet Hastanesi' },
    { id: 3, name: 'Toyota Hastanesi' },
  ];

  const clinics = [
    { id: 1, name: 'Kalp-damar', icon: require('../assets/heart.jpg') },
    { id: 2, name: 'Diş', icon: require('../assets/tooth.jpg') },
    { id: 3, name: 'Nöroloji', icon: require('../assets/brainstorm.jpg') },
  ];

  const doctors = [
    { id: 1, name: 'Ahmet Şanslı', image: require('../assets/icon1.png') },
    { id: 2, name: 'Gülcan Aksu', image: require('../assets/profile.jpg') },
    { id: 3, name: 'Zeynep İnan', image: require('../assets/profile.jpg') },
  ];

  const handleDateSelect = (day) => {
    setSelectedDate(day);
  };

  const saveAppointment = async () => {
    try {
      const user = firebase.auth().currentUser;

      if (!user) {
        console.error('Kullanıcı oturumu açık değil.');
        return;
      }

      // Firestore'da kullanıcının randevu belgesini sorgula
      const randevuBelgesi = await todoRef.doc(user.uid).get();

      if (randevuBelgesi.exists) {
        // Belge varsa, güncelleme işlemi yap
        const randevuBilgileri = {
          hastane: selectedHospital,
          polikinlik: selectedClinic,
          tarih: selectedDate,
          saat: selectedTime,
          doktorId: selectedDoctor,
          email: user.email,
        };

        console.log('***********************************');
        console.log(randevuBilgileri);

        // Belgeyi güncelle
        await todoRef.doc(user.uid).update(randevuBilgileri);
        Alert.alert('Randevu Güncellendi', 'Randevu başarıyla güncellendi.');
        
        
        console.log('Randevu başarıyla güncellendi.');
        // İlgili işlem yapılabilir, örneğin kullanıcıyı yönlendirme veya başka bir sayfaya geçiş.
      } else {
        const yeniRandevu = {
          hastane: selectedHospital,
          polikinlik: selectedClinic,
          tarih: selectedDate,
          saat: selectedTime,
          doktorId: selectedDoctor,
          email: user.email,
          // İlgili işlem yapılabilir, örneğin kullanıcıya bir mesaj gösterme veya uygun bir sayfaya yönlendirme.
        };
        console.log('***********************************');
        console.log(yeniRandevu);
        // Yeni randevuyu ekle

        await todoRef.doc(user.uid).set(yeniRandevu);

        console.log('Yeni randevu başarıyla eklendi.');
        // İlgili işlem yapılabilir, örneğin kullanıcıyı yönlendirme veya başka bir sayfaya geçiş.
        Alert.alert('Randevu Oluşturuldu', 'Randevu başarıyla oluşturuldu.');
    
      }
    } catch (hata) {
      console.error('Randevu kaydetme hatası:', hata);
      Alert.alert('Hata', 'Randevu kaydedilirken bir hata oluştu.');
    }
  };
   return (
    <ScrollView >
    <View style={styles.container}>

      <Picker
        selectedValue={selectedHospital}
        onValueChange={(itemValue) => setSelectedHospital(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Hastane Seçiniz" value={null} style={styles.selectList} />
        {hospitals.map((hospital) => (
          <Picker.Item key={hospital.name} label={hospital.name} value={hospital.name} style={styles.selectList} />
        ))}
      </Picker>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.clinicsContainer}
        enabled={true}

      >
        {clinics.map((clinic) => (
          <TouchableOpacity
            key={clinic.name}
            style={[styles.clinicBox, { backgroundColor: selectedClinic === clinic.name ? '#3498db' : 'gray' }]}
            onPress={() => setSelectedClinic(clinic.name)}
          >
            <Image source={clinic.icon} style={styles.clinicIcon} />
            <Text style={styles.clinicText}>{clinic.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.selectList}>Randevu günü seçiniz</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weekdaysContainer}
      >
        {weekdays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dayBox, { backgroundColor: selectedDate === day ? '#3498db' : 'gray' }]}
            onPress={() => handleDateSelect(day)}
          >
            <Text style={styles.dayText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.selectList}>Randevu saati seçiniz</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hoursContainer}
      >
        {[9, 10, 11, 13, 14, 15, 16, 17].map((hour) => (
          <TouchableOpacity
            key={hour}
            style={[styles.hourBox, { backgroundColor: selectedTime === hour ? '#3498db' : 'gray' }]}
            onPress={() => setSelectedTime(hour)}
          >
            <Text style={styles.hourText}>{hour}:00</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.selectList}>Doktor seçiniz</Text>

      <ScrollView
        horizontal
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.doctorsContainer}
      >
        {doctors.map((doctor) => (
          <TouchableOpacity
            key={doctor.name}
            style={[styles.doctorBox, { backgroundColor: selectedDoctor === doctor.name ? '#3498db' : 'gray' }]}
            onPress={() => setSelectedDoctor(doctor.name)}
          >
            <Image source={doctor.image} style={styles.doctorImage} />
            <Text style={styles.doctorName}>{doctor.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Button style={styles.button} title="Randevu Oluştur" onPress={saveAppointment} />
     
  </View>
  </ScrollView>
);
};

export default CreateAppointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: WIDTH,
    height: HEIGHT,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
  },
  clinicsContainer: {

    marginTop: 20,
  },
  clinicBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
  },
  clinicText: {
    marginLeft: 10,
    color: 'white',
    fontSize: 16,
  },
  clinicIcon: {
    width: 20, // İstenilen genişlik ve yüksekliği ayarlayın
    height: 20,
    marginRight: 10,
  },
  selectedText: {
    marginTop: 10,
    fontSize: 18,
  },
  selectList: {
  
    marginTop: 10,
    color: 'black',
    fontSize: 18,
  },
  hoursContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  hourBox: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
  },
  hourText: {
    color: 'white',
    fontWeight: 'bold',
  },
  weekdaysContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  dayBox: {
    height: 60,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
  },
  dayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#3498db',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    color: '#2c3e50',
  },
  doctorsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  doctorBox: {
    width: 120,
    height: 120,
    marginRight: 10,
    alignItems: 'center',
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
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
  doctorName: {
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    width: buttonWidth,
    margin:5,
    // Diğer stiller...
  },

});
