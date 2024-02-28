import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, ScrollView, Text, View, StatusBar, Dimensions, Image, FlatList, TextInput, TouchableOpacity, Keyboard, Pressable, ActivityIndicator, Button } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';  // Yeni eklenen import
import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { firebase } from './config';
import Login from './Screens/Login';
import Signin from './Screens/Signin';
import Home from './Screens/Home';
import Profile from './Screens/Profile';
import Appointment from './Screens/Appointment';
import DoctorAppointment from './Screens/DoctorAppointment';
import CreateAppointment from './Screens/CreateAppointment';
//import assets from './assets'

import Footer from './Components/Footer';
import FooterAdmin from './Components/FooterAdmin';


const Stack = createStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false); // Admin durumunu takip etmek için yeni bir state değişkeni

  // Kullanıcı durumu değişikliklerini ele al
  function onAuthStateChanged(user) {
    setUser(user);

    if (user) {
      // Eğer kullanıcı varsa, admin durumunu kontrol et
      firebase.firestore().collection('users').doc(user.uid).get()
        .then((userSnapshot) => {
          const userData = userSnapshot.data();
          setIsAdmin(userData.isAdmin);
        })
        .catch((error) => {
          console.error('Kullanıcı verileri alınırken hata oluştu:', error);
        });
    }

    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;


  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          isAdmin ? (
            <Stack.Screen
              name="DoctorAppointment"
              component={DoctorAppointment}
              options={{
                headerTitle: () => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={require('./assets/logo.jpg')}
                      style={{ width: 30, height: 30, marginRight: 5 }}
                    />
                    <Text>DoctorApp</Text>
                  </View>
                ),
                headerTitleAlign: 'center',
              }}
            />
          ) : (
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerTitle: () => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={require('./assets/logo.jpg')}
                      style={{ width: 30, height: 30, marginRight: 5 }}
                    />
                    <Text>DoctorApp</Text>
                  </View>
                ),
                headerTitleAlign: 'center',
              }}
            />
          )
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={require('./assets/logo.jpg')}
                    style={{ width: 30, height: 30, marginRight: 5 }}
                  />
                  <Text>DoctorApp</Text>
                </View>
              ),
              headerTitleAlign: 'center',
            }}
          />
          
        )}
        <Stack.Screen name="Signin" component={Signin}
          options={{
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('./assets/logo.jpg')}
                  style={{ width: 30, height: 30, marginRight: 5 }}
                />
                <Text>DoctorApp</Text>
              </View>
            ),
            headerTitleAlign: 'center',
          }} />


        <Stack.Screen
          name="Profile" component={Profile}
          options={{
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('./assets/logo.jpg')}
                  style={{ width: 30, height: 30, marginRight: 5 }}
                />
                <Text>DoctorApp</Text>
              </View>

            ),
            headerTitleAlign: 'center',
          }}
        />
       


        <Stack.Screen
          name="CreateAppointment" component={CreateAppointment}
          options={{
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('./assets/logo.jpg')}
                  style={{ width: 30, height: 30, marginRight: 5 }}
                />
                <Text>DoctorApp</Text>
              </View>
            ),
            headerTitleAlign: 'center',
          }}
        />
        


        <Stack.Screen name="Appointment" component={Appointment}
          options={{
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('./assets/logo.jpg')}
                  style={{ width: 30, height: 30, marginRight: 5 }}
                />
                <Text>DoctorApp</Text>
              </View>

            ),
            headerTitleAlign: 'center',
            
          }}
          
        />
       
      </Stack.Navigator>
      
      {user && !isAdmin && <Footer />}   
      {user && isAdmin && <FooterAdmin />}   

       </NavigationContainer>
  );
}

export default App;