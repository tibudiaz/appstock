import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const URL_API = 'https://imarketapp-84681-default-rtdb.firebaseio.com/';

const LoggedInScreen = () => {
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${URL_API}products.json`);
      const data = await response.json();
      if (data) {
        const productsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setProducts(productsArray);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleMarkSold = async (productId) => {
    try {
      const response = await fetch(`${URL_API}products/${productId}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sold: true }),
      });
      if (response.ok) {
        // Actualizar el estado de los productos
        const updatedProducts = products.map(product =>
          product.id === productId ? { ...product, sold: true } : product
        );
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.error('Error marking product as sold:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text>IMEI: {item.imei}</Text>
      <Text>Fecha de Compra: {item.purchaseDate}</Text>
      {!item.sold && (
        <Button
          title="Vendido"
          onPress={() => handleMarkSold(item.id)}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProductScreen')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Productos</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  productContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4caf50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
  },
});

export default LoggedInScreen;
