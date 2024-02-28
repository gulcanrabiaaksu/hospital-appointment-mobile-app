import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { firebase } from '../config'; // Dosya uzantısını ekledik
import { useNavigation } from '@react-navigation/native';

const Signin = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const registerUser = async (email, password, firstName, lastName) => {
        try {
            await firebase.auth().createUserWithEmailAndPassword(email, password);
            await firebase.auth().currentUser.sendEmailVerification({
                handleCodeInApp: true,
                url: 'https://hastanerandevu-cc9a6.firebaseapp.com',
            });
            await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
                firstName,
                lastName,
                email,
            });
            // Kayıt işlemi tamamlandıktan sonra Home ekranına yönlendir
            navigation.goBack('Home');

            alert('Giriş yapıldı.');
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}></Text>
            <View style={styles.inputContainer}>
                {/* İlk Ad giriş alanını siyah renkle yuvarlak içerik kutusuna al */}
                <View style={[styles.roundedInput, { backgroundColor: '#d6d7cb' }]}>
                    <TextInput
                        style={[styles.input, { color: '#fff' }]}
                        placeholder="Ad"
                        onChangeText={(firstName) => setFirstName(firstName)}
                        autoCorrect={false}
                    />
                </View>
                {/* Soyad giriş alanını siyah renkle yuvarlak içerik kutusuna al */}
                <View style={[styles.roundedInput, { backgroundColor: '#d6d7cb' }]}>
                    <TextInput
                        style={[styles.input, { color: '#fff' }]}
                        placeholder="Soyad"
                        onChangeText={(lastName) => setLastName(lastName)}
                        autoCorrect={false}
                    />
                </View>
                {/* E-posta giriş alanını siyah renkle yuvarlak içerik kutusuna al */}
                <View style={[styles.roundedInput, { backgroundColor: '#d6d7cb' }]}>
                    <TextInput
                        style={[styles.input, { color: '#fff' }]}
                        placeholder="E-mail"
                        onChangeText={(email) => setEmail(email)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                    />
                </View>
                {/* Şifre giriş alanını siyah renkle yuvarlak içerik kutusuna al */}
                <View style={[styles.roundedInput, { backgroundColor: '#d6d7cb' }]}>
                    <TextInput
                        style={[styles.input, { color: '#fff' }]}
                        placeholder="Şifre"
                        onChangeText={(password) => setPassword(password)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={true}
                    />
                </View>
            </View>
            
            <TouchableOpacity
                onPress={() => registerUser(email, password, firstName, lastName)}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Giriş</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Signin;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 100,
        justifyContent: 'center',
        paddingHorizontal: 50,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 23,
    },
    inputContainer: {
        width: '100%',
        marginTop: 20,
    },
    roundedInput: {
        borderRadius: 45,
        overflow: 'hidden',
        marginBottom: 12,
    },
    input: {
        paddingTop: 20,
        paddingBottom: 10,
        fontSize: 20,
        borderBottomColor: '#000',
        textAlign: 'center',
    },
    button: {
        height: 60,
        width: '100%',
        backgroundColor: '#3498db',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginTop: 20,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#fff',
    },
});