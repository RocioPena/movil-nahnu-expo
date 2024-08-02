import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TraductorScreen from './TraductorScreen';
import WelcomeScreen from './WelcomeScreen';
import InicioScreen from './InicioScreen';
import DiccionarioScreen from './DiccionarioScreen';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const iconColor = {
  active: '#007BFF',
  inactive: '#6C757D',
  inicio: '#0444ab',
  traductor: '#1c7b1c',
  diccionario: '#a40404',
};

// Custom header component
const HeaderTitle = ({ temaOscuro }) => (
  <View style={[styles.headerContainer, { backgroundColor: 'transparent' }]}>
    <Text style={[styles.headerTitleText, { color: temaOscuro ? '#FDF6E3' : '#333' }]}>Nanhu</Text>
  </View>
);

const MainTabs = ({ temaOscuro, alternarTema }) => {
  const [opacity] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size }) => {
            let iconName;
            const iconColorToUse = focused ? iconColor.active : iconColor.inactive;
            let specificColor;

            switch (route.name) {
              case 'Inicio':
                iconName = focused ? 'home' : 'home-outline';
                specificColor = iconColor.inicio;
                break;
              case 'Traductor':
                iconName = focused ? 'translate' : 'translate-outline';
                specificColor = iconColor.traductor;
                break;
              case 'Diccionario':
                iconName = focused ? 'book' : 'book-outline';
                specificColor = iconColor.diccionario;
                break;
              default:
                iconName = 'home-outline';
                specificColor = iconColor.inactive;
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={specificColor} />;
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Poppins_400Regular',
          },
          tabBarActiveTintColor: iconColor.active,
          tabBarInactiveTintColor: iconColor.inactive,
          tabBarStyle: {
            backgroundColor: temaOscuro ? '#222' : '#FFFFFF',
            borderTopWidth: 0,
            elevation: 5,
          },
          headerStyle: {
            backgroundColor: temaOscuro ? '#222' : '#FFFFFF',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: 'Poppins_400Regular',
            color: temaOscuro ? '#FDF6E3' : '#333',
          },
          headerTitle: () => <HeaderTitle temaOscuro={temaOscuro} />,
        })}
      >
        <Tab.Screen name="Inicio" component={InicioScreen} />
        <Tab.Screen name="Traductor">
          {() => <TraductorScreen temaOscuro={temaOscuro} />}
        </Tab.Screen>
        <Tab.Screen name="Diccionario">
          {() => <DiccionarioScreen temaOscuro={temaOscuro} />}
        </Tab.Screen>
      </Tab.Navigator>
      <Animated.View style={[styles.floatingButton, { opacity }]}>
        <TouchableOpacity 
          onPress={alternarTema}  
          accessible={true} 
          accessibilityLabel={temaOscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        >
          <MaterialCommunityIcons 
            name={temaOscuro ? 'weather-night' : 'white-balance-sunny'} 
            size={24} 
            color={temaOscuro ? '#FDF6E3' : '#F39F18'} 
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const Navigation = () => {
  const [temaOscuro, setTemaOscuro] = useState(false);

  const alternarTema = () => {
    setTemaOscuro(prevTemaOscuro => !prevTemaOscuro);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Main" 
          options={{ headerShown: false }}   
        >
          {() => <MainTabs temaOscuro={temaOscuro} alternarTema={alternarTema} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent', // Hacer el fondo transparente
  },
  headerTitleText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 28,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    borderWidth: 1,
    borderColor: 'transparent', // Hacer el borde transparente
  },
});

export default Navigation;
