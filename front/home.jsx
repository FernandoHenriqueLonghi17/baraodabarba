import React from 'react';
import { View, ScrollView, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      {/* Banner de Promoções */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoBanner}>
        <Image source={require('./assets/ic_placeholder.png')} style={styles.promoImage} />
        <Image source={require('./assets/ic_placeholder.png')} style={styles.promoImage} />
      </ScrollView>

      {/* Botão de Perfil */}
      <TouchableOpacity style={styles.profileButton}>
        <Image source={require('./assets/ic_profile.png')} style={styles.profileIcon} />
      </TouchableOpacity>

      {/* Quadrados de Serviços */}
      <View style={styles.servicesContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Corte de Cabelo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Barba</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sobrancelha</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Pacote</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 16,
  },
  promoBanner: {
    marginBottom: 16,
  },
  promoImage: {
    width: 300,
    height: 100,
    marginRight: 10,
  },
  profileButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  profileIcon: {
    width: 50,
    height: 50,
  },
  servicesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    padding: 16,
    backgroundColor: '#333333', // Ajuste a cor conforme necessário
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default App;
