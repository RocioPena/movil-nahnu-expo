import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import startImage from './assets/Cabeza.png'; 
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

const { width } = Dimensions.get('window');

const InicioScreen = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handlePress = () => {
    navigation.navigate('Main');
  };

  return (
    <LinearGradient
      colors={['#FFF', '#ACC5E9']} // Degradado de blanco a azul claro
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={startImage}
          style={styles.image}
        />
        <Text style={styles.title}>¡Bienvenido a Nanhu!</Text>
        <Text style={styles.description}>
          Nanhu es tu herramienta definitiva para traducir y consultar Náhuatl. Con nuestra app puedes:
        </Text>
        <Feature
          emoji="🔍"
          title="Traducción Rápida"
          description="Traduce textos entre Español y Náhuatl fácilmente, tanto en escrito como en audio."
        />
        <Feature
          emoji="📚"
          title="Diccionario Completo"
          description="Consulta definiciones, sinónimos y ejemplos para enriquecer tu vocabulario."
        />
        <Feature
          emoji="🗣️"
          title="Pronunciación en Tiempo Real"
          description="Escucha la pronunciación correcta de palabras en Náhuatl."
        />
      </ScrollView>
    </LinearGradient>
  );
};

const Feature = ({ emoji, title, description }) => (
  <View style={styles.featureOuterContainer}>
    <View style={styles.featureBorder}>
      <View style={styles.featureContainer}>
        <Text style={styles.featureTitle}>{emoji} {title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
    
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.85,
    height: width * 0.45,
    resizeMode: 'contain',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  featureOuterContainer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  featureBorder: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ACC5E9', // Color del borde en azul claro
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  featureContainer: {
    padding: 15,
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: '#FFFFFF',
  },
});

export default InicioScreen;
