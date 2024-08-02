import React from 'react';
import { StatusBar, SafeAreaView, StyleSheet, View } from 'react-native';
import Navigation from './Navigation'; 

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.innerContainer}>
        <Navigation />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0', 
  },
  innerContainer: {
    flex: 1,
  },
});

export default App;
