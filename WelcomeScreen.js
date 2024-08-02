import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { useFonts, Poppins_300Light, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import welcomeImage from './assets/Cabeza.png'; 
import ConsentModal from './ConsentModal';

const { width } = Dimensions.get('window'); 

const WelcomeScreen = ({ navigation, temaOscuro }) => {
  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_600SemiBold,
  });

  const [modalVisible, setModalVisible] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [buttonScale] = useState(new Animated.Value(1));
  const [buttonOpacity] = useState(new Animated.Value(1));

  const animationComplete = useRef(false); 

  useEffect(() => {
    if (modalVisible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(fadeAnim, {
          toValue: 1.05,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(fadeAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start(() => {
        animationComplete.current = true;
      });
    }
  }, [modalVisible]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonOpacity, {
          toValue: 0.6,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleAccept = () => {
    setModalVisible(false); 
  };

  const handleReject = () => {
    alert("Debes aceptar el consentimiento para usar la aplicación.");
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.9,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (animationComplete.current) {
      navigation.navigate('Main');
    } else {
      alert('Completa la animación antes de continuar.');
    }
  };

  if (!fontsLoaded) {
    return <AppLoading />; 
  }

  return (
    <View style={styles(temaOscuro).outerContainer}>
      <View style={styles(temaOscuro).borderContainer}>
        <LinearGradient
          colors={['#FFF', '#ACC5E9']} // Degradado de blanco a azul claro
          style={styles(temaOscuro).border}
        />
        <View style={styles(temaOscuro).linesContainer}>
          <View style={styles(temaOscuro).topLine} />
          <View style={styles(temaOscuro).bottomLine} />
        </View>
        <View style={styles(temaOscuro).innerContainer}>
          <View style={styles(temaOscuro).titleContainer}>
            <Text style={styles(temaOscuro).title}>Nanhu</Text>
          </View>
          <View style={styles(temaOscuro).imageContainer}>
            <Animated.Image 
              source={welcomeImage} 
              style={[styles(temaOscuro).image, { transform: [{ scale: fadeAnim }] }]} />
          </View>
          <Text style={styles(temaOscuro).description}>
            Traductor & Diccionario
          </Text>
          <View style={styles(temaOscuro).buttonContainer}>
            <Animated.View style={{ 
              transform: [{ scale: buttonScale }],
              opacity: buttonOpacity
            }}>
              <TouchableOpacity
                style={styles(temaOscuro).button}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handlePress}
              >
                <Ionicons name="arrow-forward" size={24} color="#007BFF" style={styles(temaOscuro).buttonIcon} />
              </TouchableOpacity>
            </Animated.View>
          </View>
          <ConsentModal
            visible={modalVisible}
            onAccept={handleAccept}
            onReject={handleReject}
            temaOscuro={temaOscuro}
          />
        </View>
      </View>
    </View>
  );
};

const styles = (temaOscuro) => StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Fondo blanco
  },
  borderContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 5, // Ancho del borde
    borderColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
  },
  linesContainer: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 5,
    borderColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  topLine: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 5,
    backgroundColor: '#ACC5E9', // Color del borde superior en azul claro
  },
  bottomLine: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 5,
    backgroundColor: '#ACC5E9', // Color del borde inferior en azul claro
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    position: 'relative', // Para asegurarnos de que las líneas se posicionen correctamente
  },
  titleContainer: {
    marginBottom: 20, // Añadir margen entre el título y la imagen
  },
  title: {
    fontSize: 47,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333333',
    textAlign: 'center',
    letterSpacing: 1.5,
    textShadowColor: '#ACC5E9', // Sombra del texto en azul claro
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: width * 0.9,
    height: width * 0.65,
    resizeMode: 'contain',
    borderRadius: 30,
    shadowColor: temaOscuro ? '#000000' : '#d1d1d1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 5,
  },
  description: {
    fontSize: 22,
    fontFamily: 'Poppins_300Light',
    color: temaOscuro ? '#b3b3b3' : '#212f3c',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#ACC5E9', // Sombra del texto en azul claro
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  }, 
  button: {
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007BFF', // Color de la sombra del botón
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    backgroundColor: '#f7f9f9',
  },
  buttonIcon: {
    marginLeft: 0,
  },
});

export default WelcomeScreen;
