import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useFonts, Poppins_300Light, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const { width } = Dimensions.get('window');

const ConsentModal = ({ visible, onAccept, onReject, temaOscuro }) => {
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
    >
      <View style={styles(temaOscuro).modalOverlay}>
        <View style={styles(temaOscuro).modalContainer}>
          <Text style={styles(temaOscuro).modalTitle}>Permiso de Micrófono</Text>
          <Text style={styles(temaOscuro).modalText}>
            Necesitamos acceso a tu micrófono para mejorar las traducciones con tu voz. La información se usará solo para este fin y no se compartirá.
          </Text>
          <Text style={styles(temaOscuro).modalTextrev}>
            Revisa nuestra política de privacidad aquí (enlace). Al hacer clic en 'Aceptar', autorizas el uso del micrófono. Puedes revocar el permiso en cualquier momento desde la configuración.
          </Text>
          <View style={styles(temaOscuro).modalActions}>
            <TouchableOpacity style={styles(temaOscuro).buttonAccept} onPress={onAccept}>
              <Text style={styles(temaOscuro).buttonText}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles(temaOscuro).buttonReject} onPress={onReject}>
              <Text style={styles(temaOscuro).buttonText}>Rechazar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = (temaOscuro) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly darker overlay
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: temaOscuro ? '#1e1e1e' : '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
    borderWidth: 1 ,
    borderColor: temaOscuro ? '#333' : '#ddd',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: temaOscuro ? '#f0f0f0' : '#333333',
    marginBottom: 10,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: temaOscuro ? '#444' : '#ccc',
    paddingBottom: 10,
     textShadowColor: '#728e96', // Color de sombra del título
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 5,
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Poppins_300Light',
    color:'#000000',
    marginBottom: 8,
    textAlign: 'center',
  }, 
    modalTextrev: {
    fontSize: 13,
    fontFamily: 'Poppins_300Light',
    color:'#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonAccept: {
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#57c036', // Darker green
    paddingVertical: 12,
    paddingHorizontal: 25,
    shadowColor: '#57c036',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderColor: '#57c036' 
  },
  buttonReject: {
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4040', // Darker red
    paddingVertical: 12,
    paddingHorizontal: 25,
    shadowColor: '#FF4040',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,  
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Poppins_300Light',
    color: '#ffffff',
  },
});

export default ConsentModal;
