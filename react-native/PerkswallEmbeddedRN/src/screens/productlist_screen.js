import React, {useLayoutEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {products} from '../data/product'; // Assume this is similar to your Swift static data
import ProductCard from '../components/product_card';
import {SafeAreaView} from 'react-native-safe-area-context';

const ProductListScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image
            source={require('../../assets/images/settings-icon.png')}
            style={{width: 32, height: 32}}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleBuyPress = item => {
    const perksWallType = item.type;
    const deepLinkUrl = '';

    navigation.navigate('ProductDetail', {
      perksWallType: perksWallType,
      deepLinkUrl: deepLinkUrl,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <ProductCard item={item} onBuyPress={() => handleBuyPress(item)} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default ProductListScreen;
