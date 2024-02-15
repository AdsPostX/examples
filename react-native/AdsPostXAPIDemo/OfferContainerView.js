import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import OfferView from './OfferView';
import {firePixel, openURL} from './Util';

function OfferContainerView({offers, OnCloseOfferCTA}) {
  const [currentOffer, setCurrentOffer] = useState(null);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  useEffect(() => {
    setCurrentOffer(offers[currentOfferIndex]);
    console.log('[AdsPostXAPIDemo] firing pixel/beacon now');
    firePixel(offers[currentOfferIndex]?.pixel);
  }, [currentOfferIndex]);

  const goToNextOffer = shouldClose => {
    console.log('[AdsPostXAPIDemo] Go to next Offer tapped');
    var currentIndex = currentOfferIndex;
    if (currentIndex == offers.length - 1) {
      if (!shouldClose) {
        return;
      }
      OnCloseOfferCTA(currentOfferIndex, shouldClose);
      return;
    }
    currentIndex += 1;
    setCurrentOfferIndex(currentIndex);
  };

  const goToPreviousOffer = () => {
    var currentIndex = currentOfferIndex;
    if (currentIndex == 0) {
      return;
    }
    console.log('[AdsPostXAPIDemo] Go to previous Offer tapped');
    currentIndex -= 1;
    setCurrentOfferIndex(currentIndex);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          OnCloseOfferCTA(currentOfferIndex, true);
        }}
        style={{flexDirection: 'row-reverse', padding: 8}}>
        <Text>Close</Text>
      </TouchableOpacity>
      {currentOffer && (
        <OfferView
          title={currentOffer.title}
          description={currentOffer.description}
          imageURL={currentOffer.image}
          clickURL={currentOffer.click_url}
          onImageCTA={() => {
            openURL(currentOffer?.click_url);
          }}
          positiveCTA={currentOffer.cta_yes}
          onPositiveCTA={() => {
            console.log('[AdsPostXAPIDemo] positive cta clicked');
            console.log('[AdsPostXAPIDemo] opening a link url');
            openURL(currentOffer?.click_url);
            goToNextOffer(true);
          }}
          negativeCTA={currentOffer.cta_no}
          onNegativeCTA={() => {
            console.log('[AdsPostXAPIDemo] negative cta clicked');
            console.log(
              '[AdsPostXAPIDemo] fire no-thanks beacon when negative cta tapped...',
            );
            firePixel(currentOffer?.beacons?.no_thanks_click);
            goToNextOffer(true);
          }}
        />
      )}
      <View style={styles.bottomToolBar}>
        <TouchableOpacity
          onPress={goToPreviousOffer}
          style={styles.navigationButton}>
          <Text>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            goToNextOffer(false);
          }}
          style={styles.navigationButton}>
          <Text>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    borderColor: 'black',
    borderRadius: 8,
    borderWidth: 1,
    margin: 8,
  },
  bottomToolBar: {
    height: 44,
    width: '100%',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  navigationButton: {
    backgroundColor: 'grey',
    padding: 8,
    paddingStart: 16,
    paddingEnd: 16,
  },
});

export default OfferContainerView;