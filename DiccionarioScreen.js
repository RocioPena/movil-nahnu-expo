import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  Pressable,
} from 'react-native';
import { Audio } from 'expo-av'; 
import { useFonts, Poppins_300Light, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient'; // Importar LinearGradient

const categorias = [
  { nombre: 'Personas', imagen: require('./assets/Personas.png') },
  { nombre: 'Objetos', imagen: require('./assets/Objetos.png') },
  { nombre: 'Animales', imagen: require('./assets/Animales.png') },
  { nombre: 'Naturaleza', imagen: require('./assets/Naturaleza.png') },
  { nombre: 'Alimentos', imagen: require('./assets/Alimentos.png') },
  { nombre: 'Cultura', imagen: require('./assets/Cultura.png') },
];

const vocabulario = [
  // Personas
  {
    id: '1',
    palabra: 'Tlakatl',
    traduccion: 'Hombre',
    categoria: 'Personas',
    audio: require('./assets/audio/hombre.mp3'),
  },
  {
    id: '2',
    palabra: 'Cihuatl',
    traduccion: 'Mujer',
    categoria: 'Personas',
    audio: require('./assets/audio/mujer.mp3'),
  },
  {
    id: '3',
    palabra: 'Kali',
    traduccion: 'Niño',
    categoria: 'Personas',
    audio: require('./assets/audio/nino.mp3'),
  },
  {
    id: '4',
    palabra: 'Nemi',
    traduccion: 'Anciano',
    categoria: 'Personas',
    audio: require('./assets/audio/anciano.mp3'),
  },

  // Objetos
  {
    id: '9',
    palabra: 'Calli',
    traduccion: 'Casa',
    categoria: 'Objetos',
    audio: require('./assets/audio/casa.mp3'),
  },
  {
    id: '10',
    palabra: 'Atl',
    traduccion: 'Agua',
    categoria: 'Objetos',
    audio: require('./assets/audio/agua.mp3'),
  },
  {
    id: '11',
    palabra: 'Tepeme',
    traduccion: 'Tierra',
    categoria: 'Objetos',
    audio: require('./assets/audio/tierra.mp3'),
  },
  {
    id: '12',
    palabra: 'Michin',
    traduccion: 'Cama',
    categoria: 'Objetos',
    audio: require('./assets/audio/cama.mp3'),
  },

  // Animales
  {
    id: '17',
    palabra: 'Miztli',
    traduccion: 'Gato',
    categoria: 'Animales',
    audio: null,
  },
  {
    id: '18',
    palabra: 'Cuetzpalin',
    traduccion: 'Lagartija',
    categoria: 'Animales',
    audio: null,
  },
  {
    id: '19',
    palabra: 'Itzcali',
    traduccion: 'Perro',
    categoria: 'Animales',
    audio: null,
  },
  {
    id: '20',
    palabra: 'Tototl',
    traduccion: 'Pájaro',
    categoria: 'Animales',
    audio: null,
  },

  // Naturaleza
  {
    id: '25',
    palabra: 'Tepetl',
    traduccion: 'Montaña',
    categoria: 'Naturaleza',
    audio: null,
  },
  {
    id: '26',
    palabra: 'Cenote',
    traduccion: 'Pozo natural',
    categoria: 'Naturaleza',
    audio: null,
  },
  {
    id: '27',
    palabra: 'Sahuayo',
    traduccion: 'Río',
    categoria: 'Naturaleza',
    audio: null,
  },
  {
    id: '28',
    palabra: 'Tlaltecpatl',
    traduccion: 'Arbusto',
    categoria: 'Naturaleza',
    audio: null,
  },

  // Alimentos
  {
    id: '33',
    palabra: 'Awakatl',
    traduccion: 'Aguacate',
    categoria: 'Alimentos',
    audio: null,
  },
  {
    id: '34',
    palabra: 'Elotl',
    traduccion: 'Elote',
    categoria: 'Alimentos',
    audio: null,
  },
  {
    id: '35',
    palabra: 'Nakatl',
    traduccion: 'Carne',
    categoria: 'Alimentos',
    audio: null,
  },
  {
    id: '36',
    palabra: 'Laxkalli',
    traduccion: 'Tortilla',
    categoria: 'Alimentos',
    audio: null,
  },

  // Cultura
  {
    id: '44',
    palabra: 'Ilwitl',
    traduccion: 'Fiesta del pueblo o popular',
    categoria: 'Cultura',
    audio: null,
  },
  {
    id: '45',
    palabra: 'Coyol',
    traduccion: 'Tambor',
    categoria: 'Cultura',
    audio: null,
  },
  {
    id: '46',
    palabra: 'Yohualt',
    traduccion: 'Canto ceremonial',
    categoria: 'Cultura',
    audio: null,
  },
  {
    id: '47',
    palabra: 'Mitote',
    traduccion: 'Ceremonia',
    categoria: 'Cultura',
    audio: null,
  },
];

const DiccionarioScreen = ({ temaOscuro }) => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_600SemiBold,
  });

  const playSound = async (audio) => {
    if (audio) {
      try {
        const { sound } = await Audio.Sound.createAsync(audio, { shouldPlay: true });
        await sound.playAsync();
      } catch (error) {
        console.log('Error al cargar el archivo de audio', error);
      }
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleCategoriaSeleccionada = (categoria) => {
    setCategoriaSeleccionada(categoria);
  };

  const volverACategorias = () => {
    setCategoriaSeleccionada(null);
    setSearchTerm('');
  };

  const vocabularioFiltrado = categoriaSeleccionada
    ? vocabulario.filter((item) => item.categoria === categoriaSeleccionada.nombre)
    : vocabulario;

  const vocabularioBusqueda = vocabularioFiltrado.filter((item) =>
    item.palabra.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={[styles.item, temaOscuro ? styles.itemOscuro : styles.itemClaro]}>
      <Text style={[styles.palabra, temaOscuro ? styles.textoOscuro : styles.textoClaro]}>
        {item.palabra}
      </Text>
      <Text style={[styles.traduccion, temaOscuro ? styles.textoOscuro : styles.textoClaro]}>
        {item.traduccion}
      </Text>
      <TouchableOpacity onPress={() => playSound(item.audio)}>
        <AntDesign name="sound" size={27} color="#57c036" />
      </TouchableOpacity>
    </View>
  );

  const renderCategoria = ({ item }) => (
    <Pressable onPress={() => handleCategoriaSeleccionada(item)} style={styles.categoria}>
      <Image source={item.imagen} style={styles.categoriaImagen} />
      <Text style={[styles.categoriaTexto, temaOscuro ? styles.textoOscuro : styles.textoClaro]}>
        {item.nombre}
      </Text>
    </Pressable>
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Cargando fuentes...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={temaOscuro ? ['#333', '#444'] : ['#FFF', '#ACC5E9']} // Degradado de fondo
      style={[styles.container, temaOscuro ? styles.containerOscuro : styles.containerClaro]}
    >
      {categoriaSeleccionada ? (
        <>
          <TextInput
            style={[styles.searchInput, temaOscuro ? styles.inputOscuro : styles.inputClaro]}
            placeholder="Buscar palabra..."
            placeholderTextColor={temaOscuro ? "#ccc" : "#666"}
            onChangeText={setSearchTerm}
            value={searchTerm}
          />
          <FlatList
            data={vocabularioBusqueda}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
          <TouchableOpacity onPress={volverACategorias} style={styles.volverButton}>
            <Ionicons name="arrow-back" size={24} color={temaOscuro ? "#ccc" : "#333"} />
          </TouchableOpacity>
        </>
      ) : (
        <FlatList
          data={categorias}
          renderItem={renderCategoria}
          keyExtractor={(item) => item.nombre}
          numColumns={2}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  containerOscuro: {
    backgroundColor: '#333',
  },
  containerClaro: {
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontFamily: 'Poppins_300Light',
    fontSize: 16,
  },
  inputOscuro: {
    color: '#333',
    backgroundColor: '#ccc',
    borderColor: '#666',
  },
  inputClaro: {
    color: '#333',
    backgroundColor: '#f0f0f0',
  },
  categoria: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  categoriaImagen: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  categoriaTexto: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#ccc',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  itemOscuro: {
    backgroundColor: '#444',
    borderColor: '#555',
  },
  itemClaro: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  palabra: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 18,
    color: '#333',
  },
  traduccion: {
    fontFamily: 'Poppins_300Light',
    fontSize: 17,
    color: '#666',
  },
  textoOscuro: {
    color: '#ffffff',
  },
  textoClaro: {
    color: '#333',
  },
  volverButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
});

export default DiccionarioScreen;
