import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
  const navigation = useNavigation();

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  const navigateToRandevu = () => {
    navigation.navigate('Appointment');
  };

  const navigateToProfil = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.footerContainer}>
      <View style={styles.footerContent}>
        <TouchableOpacity style={styles.footerButton} onPress={navigateToHome}>
          <Text style={styles.buttonText}>Anasayfa</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity style={styles.footerButton} onPress={navigateToRandevu}>
          <Text style={styles.buttonText}>Randevularım</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity style={styles.footerButton} onPress={navigateToProfil}>
          <Text style={styles.buttonText}>Profilim</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3498db',
    borderTopWidth: 2,
    borderTopColor: '#2980b9',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Değişiklik burada
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ecf0f1',
  },
  separator: {
    height: '80%', // Değişiklik burada
    width: 2,
    backgroundColor: '#ecf0f1',
  },
});

export default Footer;