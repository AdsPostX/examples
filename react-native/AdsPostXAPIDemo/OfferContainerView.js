import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import OfferView from './OfferView';
import {firePixel, openURL} from './Util';

function OfferContainerView({
  offers,
  closeOfferCTAAction,
  goToPreviousOfferCTAAction,
  goToNextOfferCTAAction,
}) {
  const [currentOffer, setCurrentOffer] = useState(null);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  useEffect(() => {
    setCurrentOffer(offers[currentOfferIndex]);
  }, [currentOfferIndex, offers]);

  const goToNextOffer = () => {
    var currentIndex = currentOfferIndex;
    if (currentIndex == offers.length - 1) {
      closeOfferCTAAction(false, currentOfferIndex);
      return;
    }
    console.log('[AdsPostXAPIDemo] Go to next Offer tapped');
    currentIndex += 1;
    setCurrentOfferIndex(currentIndex);
    goToNextOfferCTAAction(currentOfferIndex);
  };

  const goToPreviousOffer = () => {
    console.log('[AdsPostXAPIDemo] Go to previous Offer tapped');
    var currentIndex = currentOfferIndex;
    if (currentIndex == 0) {
      return;
    }
    currentIndex -= 1;
    setCurrentOfferIndex(currentIndex);
    goToPreviousOfferCTAAction(currentOfferIndex);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          closeOfferCTAAction(true, currentOfferIndex);
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
          onLoadCallback={() => {
            console.log(
              '[AdsPostXAPIDemo] fire pixel when offer rendered on screen first time..',
            );
            firePixel(currentOffer?.pixel);
          }}
          imageCTAAction={() => {
            openURL(currentOffer?.click_url);
          }}
          positiveCTA={currentOffer.cta_yes}
          positiveCTAAction={() => {
            console.log('[AdsPostXAPIDemo] positive cta clicked');
            console.log('[AdsPostXAPIDemo] opening a link url');
            openURL(currentOffer?.click_url);
            goToNextOffer();
          }}
          negativeCTA={currentOffer.cta_no}
          negativeCTAAction={() => {
            console.log('[AdsPostXAPIDemo] negetive cta clicked');
            console.log(
              '[AdsPostXAPIDemo] fire no thanks beacon when -ve cta tapped...',
            );
            firePixel(currentOffer?.beacons?.no_thanks_click);
            goToNextOffer();
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
          onPress={goToNextOffer}
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
