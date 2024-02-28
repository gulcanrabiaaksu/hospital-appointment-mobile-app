import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert,TouchableOpacity } from 'react-native';
import { firebase } from '../config'; // Firebase konfigürasyonunuza göre düzenleyin

import Footer from '../Components/Footer'; // Footer component'inin bulunduğu dizini doğru şekilde güncelleyin
import Header from '../Components/Header';
import { ScrollView } from 'react-native-gesture-handler';

const Profile = ({ navigation }) => {
  const user = firebase.auth().currentUser;
  const [isEditMode, setEditMode] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    // Firestore'dan kullanıcının bilgilerini al
    const userRef = firebase.firestore().collection('users').doc(user.uid);

    userRef.get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setEmail(data.email || '');
        setGender(data.gender || '');
        setAge(data.age || '');
        setPhoneNumber(data.phoneNumber || '');
        setAddress(data.address || '');
      }else {
        console.log('Kullanıcı verileri bulunamadı');
      }
    });
  }, [user]);

  const enableEditMode = () => {
    setEditMode(true);
  };

  const saveChanges = () => {
    // Firestore'da kullanıcının bilgilerini güncelle
    const userRef = firebase.firestore().collection('users').doc(user.uid);

    userRef.set({
      firstName: firstName,
      lastName: lastName,
      email: email,
      gender: gender,
      age: age,
      phoneNumber: phoneNumber,
      address: address,
    }, { merge: true }) // merge: true, belirtilmezse diğer bilgileri siler, bu şekilde sadece güncellenen alanları günceller
    .then(() => {
      setEditMode(false);
      Alert.alert('Bilgiler güncellendi.');
    })
    .catch((error) => {
      Alert.alert('Bilgiler güncellenirken bir hata oluştu.');
    });
  };

  const handleLogout = () => {
    firebase.auth().signOut()
      .then(() => {
        navigation.navigate('Login'); // Çıkış yapıldığında login sayfasına yönlendir
      })
      .catch((error) => {
        console.error('Çıkış yapılırken bir hata oluştu:', error);
      });
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      
      <Text style={styles.label}>Ad:</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        editable={isEditMode}
      />

      <Text style={styles.label}>Soyad:</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        editable={isEditMode}
      />

      <Text style={styles.label}>E-posta:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        editable={false}
      />

      <Text style={styles.label}>Cinsiyet:</Text>
        <TextInput
          style={styles.input}
          value={gender}
          onChangeText={setGender}
          editable={isEditMode}
        />

      <Text style={styles.label}>Yaş:</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          editable={isEditMode}
        />

      <Text style={styles.label}>Telefon Numarası:</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
          editable={isEditMode}
        />

      <Text style={styles.label}>Adres:</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        editable={isEditMode}
      />

      {isEditMode ? (
        <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
          <Text style={styles.buttonText}>Kaydet</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={enableEditMode}>
          <Text style={styles.buttonText}>Güncelle</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Profile;
