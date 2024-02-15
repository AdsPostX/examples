import React, {useEffect} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';

function OfferView({
  title,
  imageURL,
  description,
  clickURL,
  onImageCTA,
  positiveCTA,
  onPositiveCTA,
  negativeCTA,
  onNegativeCTA,
}) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {imageURL && (
        <TouchableOpacity onPress={onImageCTA}>
          <Image
            source={{uri: `${imageURL}`}}
            resizeMode="contain"
            style={styles.image}
          />
        </TouchableOpacity>
      )}
      {description && <Text style={styles.description}>{description}</Text>}
      <View style={styles.ctaContainer}>
        {positiveCTA && (
          <TouchableOpacity
            onPress={onPositiveCTA}
            style={[styles.cta, {backgroundColor: '#3565A9'}]}>
            <Text style={styles.ctaText}>{positiveCTA}</Text>
          </TouchableOpacity>
        )}
        {negativeCTA && (
          <TouchableOpacity
            onPress={onNegativeCTA}
            style={[styles.cta, {backgroundColor: 'grey'}]}>
            <Text style={styles.ctaText}>{negativeCTA}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  title: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#3565A9',
    fontSize: 20,
    padding: 8,
    marginBottom: 16,
  },
  image: {
    height: 150,
    width: '100%',
  },
  description: {
    textAlign: 'center',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  ctaContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cta: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  ctaText: {
    color: 'white',
  },
});

export default OfferView;
