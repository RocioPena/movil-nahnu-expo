import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_300Light,
} from '@expo-google-fonts/poppins';
import * as Speech from 'expo-speech';
import AppLoading from 'expo-app-loading';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker'; // Asegúrate de que esta importación esté correcta

const { width } = Dimensions.get('window');

const TraductorScreen = ({ temaOscuro }) => {
  const [textoEntrada, setTextoEntrada] = useState('');
  const [textoTraducido, setTextoTraducido] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [idiomaOrigen, setIdiomaOrigen] = useState('es');
  const [idiomaDestino, setIdiomaDestino] = useState('nah');
  const [modalVisible, setModalVisible] = useState(false);
  const [nahuatlData] = useState({
    Hombre: 'Tlakatl',
    Mujer: 'Cihuatl',
    Niño: 'Pilli',
    Agua: 'Atl',
    Casa: 'Calli',
  });

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_300Light,
  });

  const traducirTexto = () => {
    setIsLoading(true);
    let traduccion;
    if (idiomaOrigen === 'es') {
      traduccion = nahuatlData[textoEntrada];
    } else {
      traduccion = Object.keys(nahuatlData).find(
        (key) => nahuatlData[key] === textoEntrada
      );
    }
    setTextoTraducido(traduccion || 'Traducción no encontrada');
    setIsLoading(false);
    setModalVisible(true); // Mostrar el modal cuando la traducción esté disponible
  };

  const cambiarIdiomaOrigen = (idioma) => {
    setIdiomaOrigen(idioma);
    limpiarTraduccion();
  };

  const cambiarIdiomaDestino = (idioma) => {
    setIdiomaDestino(idioma);
    limpiarTraduccion();
  };

  const limpiarTraduccion = () => {
    setTextoEntrada('');
    setTextoTraducido('');
    setModalVisible(false); // Cerrar el modal al limpiar la traducción
  };

  const reproducirPronunciacion = () => {
    if (textoTraducido) {
      Speech.speak(textoTraducido, { language: idiomaDestino });
    }
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const themeStyles = styles(temaOscuro);

  return (
    <LinearGradient
      colors={temaOscuro ? ['#1e1e1e', '#333'] : ['#ACC5E9', '#FFFFFF']} // Degradado de colores según el tema
      style={themeStyles.container}>
      <View style={themeStyles.idiomaContainer}>
        <Picker
          selectedValue={idiomaOrigen}
          style={[
            themeStyles.idiomaPicker,
            idiomaOrigen === 'es' && themeStyles.idiomaPickerSelected,
          ]}
          onValueChange={(itemValue) => cambiarIdiomaOrigen(itemValue)}>
          <Picker.Item label="Español" value="es" />
          <Picker.Item label="Náhuatl" value="nah" />
        </Picker>
        <Picker
          selectedValue={idiomaDestino}
          style={[
            themeStyles.idiomaPicker,
            idiomaDestino === 'nah' && themeStyles.idiomaPickerSelected,
          ]}
          onValueChange={(itemValue) => cambiarIdiomaDestino(itemValue)}>
          <Picker.Item label="Español" value="es" />
          <Picker.Item label="Náhuatl" value="nah" />
        </Picker>
        <TextInput
          style={themeStyles.input}
          placeholder={`Escribe el texto en ${
            idiomaOrigen === 'es' ? 'Español' : 'Náhuatl'
          }`}
          placeholderTextColor={temaOscuro ? '#888' : '#AAA'}
          value={textoEntrada}
          onChangeText={setTextoEntrada}
        />
        <View style={themeStyles.buttonsContainer}>
          <TouchableOpacity
            style={themeStyles.translateButton}
            onPress={traducirTexto}
            disabled={isLoading}>
            <Text style={themeStyles.buttonText}>Traducir</Text>
          </TouchableOpacity>
        </View>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={temaOscuro ? '#FFFFFF' : '#000000'}
          />
        )}

        {/* Modal para mostrar el resultado */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={themeStyles.modalOverlay}>
            <View style={themeStyles.modalContent}>
              <Text style={themeStyles.resultado}>{textoTraducido}</Text>
              <View style={themeStyles.modalButtonsContainer}>
                <TouchableOpacity
                  style={themeStyles.playButton}
                  onPress={reproducirPronunciacion}
                  disabled={!textoTraducido}>
                  <Text style={themeStyles.buttonText}>Reproducir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={themeStyles.closeButton}
                  onPress={() => setModalVisible(false)}>
                  <Text style={themeStyles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

const styles = (temaOscuro) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 15,
      backgroundColor: temaOscuro ? '#1e1e1e' : '#ffffff',
      fontFamily: 'Poppins_300Light',
    },
    idiomaContainer: {
      width: width * 0.9,
      backgroundColor: temaOscuro ? '#1e1e1e' : '#ffffff',
      borderRadius: 20,
      padding: 20,
      shadowColor: temaOscuro ? '#000' : '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: temaOscuro ? 0.5 : 0.3,
      shadowRadius: 15,
      elevation: 10,
      borderWidth: 1,
      borderColor: temaOscuro ? '#333' : '#ddd',
      alignItems: 'center', // Centra los elementos dentro del contenedor
    },
    idiomaPicker: {
      width: '100%', // Ajustar al ancho del contenedor
      height: 40,
      color: temaOscuro ? '#FFF' : '#000',
      borderColor: temaOscuro ? '#555' : '#DDD',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 15,
      backgroundColor: temaOscuro ? '#444' : '#FFF',
      fontFamily: 'Poppins_300Light',
    },
    idiomaPickerSelected: {
      borderColor: temaOscuro ? '#ACC5E9' : '#007BFF',
    },
    input: {
      width: '100%', // Ajustar al ancho del contenedor
      height: 50,
      borderColor: temaOscuro ? '#555' : '#DDD',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 20,
      color: temaOscuro ? '#FFF' : '#000',
      fontFamily: 'Poppins_300Light',
      fontSize: 16,
    },
    buttonsContainer: {
      width: '100%', // Asegura que el contenedor de botones ocupe todo el ancho disponible
      flexDirection: 'row',
      justifyContent: 'center', // Centra los botones horizontalmente
      marginBottom: 20,
    },
    translateButton: {
      backgroundColor: temaOscuro ? '#FF7D00' : '#FF7D00', // Color naranja
      paddingVertical: 12,
      paddingHorizontal: 20,
      shadowColor: temaOscuro ? '#FF4040' : '#FF4040',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: temaOscuro ? 0.5 : 0.3,
      shadowRadius: 8,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      width: 110, // Ajustar al tamaño deseado
      height: 50, // Ajustar al tamaño deseado
      marginHorizontal: 5,
    },
    playButton: {
      backgroundColor: temaOscuro ? '#57c036' : '#57c036', // Color verde
      paddingVertical: 12,
      paddingHorizontal: 20,
      shadowColor: temaOscuro ? '#57c036' : '#57c036',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: temaOscuro ? 0.5 : 0.3,
      shadowRadius: 8,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      width: 110, // Ajustar al tamaño deseado
      height: 50, // Ajustar al tamaño deseado
      marginHorizontal: 5,
    },
    closeButton: {
      backgroundColor: temaOscuro ? '#FF4040' : '#FF4040', // Color rojo
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      width: 110, // Ajustar al tamaño deseado
      height: 50, // Ajustar al tamaño deseado
      marginHorizontal: 5,
      marginTop: 5,
    },
    buttonText: {
      fontSize: 14,
      fontFamily: 'Poppins_300Light',
      color: '#ffffff',
    },
    resultado: {
      fontSize: 18,
      color: temaOscuro ? '#CCC' : '#333',
      fontFamily: 'Poppins_400Regular',
      textAlign: 'center',
      marginVertical: 20,
      width: '100%',
      backgroundColor: temaOscuro ? '#1e1e1e' : '#ffffff',
      borderRadius: 20,
      padding: 20,
      shadowColor: temaOscuro ? '#000' : '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: temaOscuro ? 0.5 : 0.3, 
      shadowRadius: 15,
      elevation: 10,
      borderWidth: 1,
      borderColor: temaOscuro ? '#333' : '#ddd',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: width * 0.9,
      backgroundColor: temaOscuro ? '#1e1e1e' : '#ffffff',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center', // Centra el contenido dentro del modal
      shadowColor: temaOscuro ? '#000' : '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: temaOscuro ? 0.5 : 0.3,
      shadowRadius: 15,
      elevation: 10,
      borderWidth: 1,
      borderColor: temaOscuro ? '#333' : '#ddd',
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between', // Distribuye los botones uniformemente
      marginTop: 20,
      width: '100%', // Asegura que los botones ocupen todo el ancho disponible
    },
  });

export default TraductorScreen;
