import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';

const URL_API = 'https://imarketapp-84681-default-rtdb.firebaseio.com/';

const AddProductScreen = () => {
  const [name, setName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [price, setPrice] = useState('');
  const [imei, setImei] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarcodeScanned = ({ data }) => {
    // Guardar el código de barras como IMEI
    setImei(data);
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch(`${URL_API}products.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          purchaseDate,
          price,
          imei,
          sold: false,
        }),
      });

      if (response.ok) {
        // Producto agregado exitosamente, volver a la pantalla anterior
        navigation.goBack();
      } else {
        console.error('Error al agregar el producto');
      }
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nombre del Producto"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Fecha de Compra"
        value={purchaseDate}
        onChangeText={setPurchaseDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate('BarcodeScanner')}
      >
        <Text style={styles.scanButtonText}>Escanear Código de Barras</Text>
      </TouchableOpacity>
      <Text style={styles.imeiText}>IMEI: {imei}</Text>
      <Button title="Agregar Producto" onPress={handleAddProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  scanButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  scanButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  imeiText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default AddProductScreen;
