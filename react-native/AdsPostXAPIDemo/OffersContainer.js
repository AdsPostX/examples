import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Linking,
} from 'react-native';
import OfferView from './OfferView';
import axios from 'axios';

function OffersContainer({offers, closeOfferCTAAction}) {
  const [currentOffer, setCurrentOffer] = useState(null);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  useEffect(() => {
    setCurrentOffer(offers[currentOfferIndex]);
  }, [currentOfferIndex, offers]);

  const openURL = async url => {
    if (url) {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        // console.log(`[AdsPostXAPIDemo] Cannot open URL: ${url}`);
      }
    }
  };

  const firePixel = url => {
    if (url) {
      axios
        .get(url)
        .then(response => {
          //   console.log('[AdsPostXAPIDemo] fire pixel Success:', response.data);
        })
        .catch(error => {
          //   console.error('fire pixel Error:', error);
        });
    }
  };

  const goToPreviousOffer = () => {
    var currentIndex = currentOfferIndex;
    if (currentIndex == 0) {
      return;
    }
    console.log('[AdsPostXAPIDemo] Go to previous Offer tapped');
    currentIndex -= 1;
    setCurrentOfferIndex(currentIndex);
    let newOffer = offers[currentIndex];
    console.log(
      '[AdsPostXAPIDemo] fire pixel when previous offer is displayed',
    );
    firePixel(newOffer?.pixel);
  };

  const goToNextOffer = () => {
    var currentIndex = currentOfferIndex;
    if (currentIndex == offers.length - 1) {
      closeOfferCTAAction();
      return;
    }
    console.log('[AdsPostXAPIDemo] Go to next Offer tapped');
    currentIndex += 1;
    setCurrentOfferIndex(currentIndex);

    let newOffer = offers[currentIndex];
    console.log('[AdsPostXAPIDemo] fire pixel when next offer is displayed');
    firePixel(newOffer?.pixel);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          console.log(
            '[AdsPostXAPIDemo] fire beacon when close button tapped.',
          );
          firePixel(currentOffer?.beacons?.close);
          closeOfferCTAAction();
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

export default OffersContainer;
