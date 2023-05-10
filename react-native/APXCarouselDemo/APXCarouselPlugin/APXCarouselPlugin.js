import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
  Linking,
  Button,
} from 'react-native';

import NetworkLayer from '../APXCarouselPlugin/NetworkLayer';
import WebViewModal from '../APXCarouselPlugin/WebViewModal';

import FastImage from 'react-native-fast-image';
import RenderHtml from 'react-native-render-html';
import SnapCarousel, {Pagination} from 'react-native-snap-carousel';
import {DEFAULT_COLORS, ENVIRONMENT, LAYOUT, LINK} from './Constants';
import {RFValue} from 'react-native-responsive-fontsize';

function APXCarouselPlugin({
  layout = LAYOUT.stack,
  layoutCardOffset = '18',
  environment = ENVIRONMENT.live,
  apiKey,
  userAttributes = {},
  showPagination = true,
  sliderHeight = null,
  sliderWidth = null,
  autoPlay = false,
  autoPlayDelay = 2,
  autoPlayLoop = false,
  loop = false,
  paginationActiveColor = DEFAULT_COLORS.paginationActiveDarkColor,
  paginationDefaultColor = DEFAULT_COLORS.paginationDefaultColor,
  currentItem,
  onPressItem,
  openLinkIn = LINK.external,
  contentAlignment = 'center',
}) {
  const scrollRef = useRef(null);
  let isMounted = true; // flag to track if the component is still mounted
  const paginationMinHeight = showPagination ? 30 : 0;
  const dotStyle = {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: paginationActiveColor,
  };
  const inactiveDotStyle = {
    backgroundColor: paginationDefaultColor,
  };

  const htmlStyles = {
    div: {
      padding: 8,
      textAlign: contentAlignment,
    },
  };
  const ctaContainerStyle = {
    width: '100%',
    flexDirection: 'row',
    alignItems:
      contentAlignment === 'left'
        ? 'flex-start'
        : contentAlignment === 'right'
        ? 'flex-end'
        : 'center',
    justifyContent:
      contentAlignment === 'left'
        ? 'flex-start'
        : contentAlignment === 'right'
        ? 'flex-end'
        : 'center',
  };

  const [carouselItems, setCarouselItems] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [urlToLoad, setUrlToLoad] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nativeStyles, setNativeStyles] = useState({});
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get('window').width,
  );
  const [windowHeight, setWindowHeight] = useState(
    Dimensions.get('window').height,
  );

  const [carouselHeight, setCarouselHeight] = useState(sliderHeight);
  const [carouselWidth, setCarouselWidth] = useState(sliderWidth);
  const [carouselItemWidth, setCarouselItemWidth] = useState(10);
  const [sliderContainerStyle, setSliderContainerStyle] = useState({
    width: carouselWidth,
    flexDirection: 'row',
    height: carouselHeight,
  });
  const [topRightBorderRadius, setTopRightBorderRadius] = useState(10);
  const [topLeftBorderRadius, setTopLeftBorderRadius] = useState(10);
  const [bottomRightBorderRadius, setBottomRightBorderRadius] = useState(10);
  const [bottomLeftBorderRadius, setBottomLeftBorderRadius] = useState(10);
  const [childStyle, setChildStyle] = useState({
    backgroundColor:
      nativeStyles.popup && nativeStyles.popup.background
        ? nativeStyles.popup.background
        : DEFAULT_COLORS.popUpBackgroundColor,
    borderTopLeftRadius: topLeftBorderRadius,
    borderTopRightRadius: topRightBorderRadius,
    borderBottomRightRadius: bottomRightBorderRadius,
    borderBottomLeftRadius: bottomLeftBorderRadius,
    height: carouselHeight - paginationMinHeight,
    width: carouselWidth,
  });
  const [textsContainerStyle, setTextsContainerStyle] = useState({
    width: '65%',
    height: carouselHeight - paginationMinHeight,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  });

  const [titleContainerStyle, setTitleContainerStyle] = useState({
    padding: 8,
    width: '100%',
    backgroundColor:
      nativeStyles.header && nativeStyles.header.background
        ? nativeStyles.header.background
        : DEFAULT_COLORS.titleContainerBackgroundColor,
    justifyContent:
      contentAlignment === 'left'
        ? 'flex-start'
        : contentAlignment === 'right'
        ? 'flex-end'
        : 'center',
    alignItems:
      contentAlignment === 'left'
        ? 'flex-start'
        : contentAlignment === 'right'
        ? 'flex-end'
        : 'center',
  });
  const [titleStyle, setTitleStyle] = useState({
    fontSize: RFValue(14),
    fontWeight: 'bold',
    textAlign: contentAlignment,
    color:
      nativeStyles.header && nativeStyles.header.textColor
        ? nativeStyles.header.textColor
        : DEFAULT_COLORS.lightTextColor,
  });
  const [imageContainerStyle, setImageContainerStyle] = useState({
    width: '33%',
    height: carouselHeight - paginationMinHeight,
    padding: 8,
  });
  const [baseFontStyle, setBaseFontStyle] = useState({
    fontSize: RFValue(12),
    color:
      nativeStyles.offerText && nativeStyles.offerText.textColor
        ? nativeStyles.offerText.textColor
        : DEFAULT_COLORS.darkTextColor,
  });
  const [ctaButtonStyle, setCtaButtonStyle] = useState({
    backgroundColor:
      nativeStyles.offerText &&
      nativeStyles.offerText.buttonYes &&
      nativeStyles.offerText.buttonYes.background
        ? nativeStyles.offerText.buttonYes.background
        : DEFAULT_COLORS.buttonBackgroundColor,
    padding: 8,
  });
  const [ctaTextStyle, setCtaTextStyle] = useState({
    color:
      nativeStyles.offerText &&
      nativeStyles.offerText.buttonYes &&
      nativeStyles.offerText.buttonYes.color
        ? nativeStyles.offerText.buttonYes.color
        : DEFAULT_COLORS.lightTextColor,
    fontSize: RFValue(12),
    textAlign: 'center',
  });

  useEffect(() => {
    checkAndSetCarouselDefaultHeightAndWidth();
  }, [windowWidth, windowHeight]);

  useEffect(() => {
    setSliderContainerStyle({
      ...sliderContainerStyle,
      height: carouselHeight,
      width: carouselWidth,
    });
  }, [carouselHeight, carouselWidth]);

  useEffect(() => {
    setChildStyle({
      backgroundColor:
        nativeStyles.popup && nativeStyles.popup.background
          ? nativeStyles.popup.background
          : DEFAULT_COLORS.popUpBackgroundColor,
      borderTopLeftRadius: topLeftBorderRadius,
      borderTopRightRadius: topRightBorderRadius,
      borderBottomRightRadius: bottomRightBorderRadius,
      borderBottomLeftRadius: bottomLeftBorderRadius,
      height: carouselHeight - paginationMinHeight,
      width: carouselWidth,
    });
  }, [nativeStyles, carouselHeight, carouselWidth]);

  useEffect(() => {
    setTextsContainerStyle({
      ...textsContainerStyle,
      height: carouselHeight - paginationMinHeight,
    });
    setImageContainerStyle({
      ...imageContainerStyle,
      height: carouselHeight - paginationMinHeight,
    });
  }, [carouselHeight]);

  useEffect(() => {
    setTopRightBorderRadius(
      nativeStyles.popup &&
        nativeStyles.popup.borderRadius &&
        nativeStyles.popup.borderRadius.top_right
        ? parseInt(nativeStyles.popup.borderRadius.top_right)
        : 10,
    );
    setTopLeftBorderRadius(
      nativeStyles.popup &&
        nativeStyles.popup.borderRadius &&
        nativeStyles.popup.borderRadius.top_left
        ? parseInt(nativeStyles.popup.borderRadius.top_left)
        : 10,
    );
    setBottomRightBorderRadius(
      nativeStyles.popup &&
        nativeStyles.popup.borderRadius &&
        nativeStyles.popup.borderRadius.bottom_right
        ? parseInt(nativeStyles.popup.borderRadius.bottom_right)
        : 10,
    );
    setBottomLeftBorderRadius(
      nativeStyles.popup &&
        nativeStyles.popup.borderRadius &&
        nativeStyles.popup.borderRadius.bottom_left
        ? parseInt(nativeStyles.popup.borderRadius.bottom_left)
        : 10,
    );
    setBaseFontStyle({
      ...baseFontStyle,
      color:
        nativeStyles.offerText && nativeStyles.offerText.textColor
          ? nativeStyles.offerText.textColor
          : DEFAULT_COLORS.darkTextColor,
    });

    setTitleContainerStyle({
      ...titleContainerStyle,
      backgroundColor:
        nativeStyles.header && nativeStyles.header.background
          ? nativeStyles.header.background
          : DEFAULT_COLORS.titleContainerBackgroundColor,
    });
    setTitleStyle({
      ...titleStyle,
      color:
        nativeStyles.header && nativeStyles.header.textColor
          ? nativeStyles.header.textColor
          : DEFAULT_COLORS.lightTextColor,
    });
    setCtaButtonStyle({
      ...ctaButtonStyle,
      backgroundColor:
        nativeStyles.offerText &&
        nativeStyles.offerText.buttonYes &&
        nativeStyles.offerText.buttonYes.background
          ? nativeStyles.offerText.buttonYes.background
          : DEFAULT_COLORS.buttonBackgroundColor,
    });
    setCtaTextStyle({
      ...ctaTextStyle,
      color:
        nativeStyles.offerText &&
        nativeStyles.offerText.buttonYes &&
        nativeStyles.offerText.buttonYes.color
          ? nativeStyles.offerText.buttonYes.color
          : DEFAULT_COLORS.lightTextColor,
    });
  }, [nativeStyles]);

  const checkMandatoryParam = (param, paramName) => {
    if (!param) {
      throw new Error(`${paramName} is mandatory and must have a valid value`);
    }
  };

  const checkEnumParam = (param, paramName, values) => {
    const lowercaseParam = param && param.toLowerCase();
    if (!lowercaseParam || !values.includes(lowercaseParam)) {
      const valuesString = values.join(', ');
      throw new Error(`${paramName} must be one of: ${valuesString}`);
    }
  };

  checkMandatoryParam(environment, 'environment');
  checkMandatoryParam(apiKey, 'apiKey');

  checkEnumParam(environment, 'environment', [
    ENVIRONMENT.live,
    ENVIRONMENT.test,
  ]);
  checkEnumParam(openLinkIn, 'openLinkIn', [LINK.external, LINK.inapp]);
  checkEnumParam(contentAlignment, 'contentAlignment', [
    'left',
    'right',
    'center',
  ]);

  const checkAndSetCarouselDefaultHeightAndWidth = () => {
    if (!sliderHeight) {
      setCarouselHeight(showPagination ? RFValue(230) : RFValue(210));
    }

    if (!sliderWidth) {
      const width = windowWidth * 0.8;
      setCarouselWidth(width);
      setCarouselItemWidth(width * 0.9);
    } else {
      setCarouselWidth(sliderWidth);
      setCarouselItemWidth(sliderWidth * 0.9);
    }
  };

  const handleDimensionsChange = dimensions => {
    setWindowWidth(dimensions.window.width);
    setWindowHeight(dimensions.window.height);
  };

  useEffect(() => {
    Dimensions.addEventListener('change', handleDimensionsChange);
    loadOffers();
    // Cleanup function
    return () => {
      Dimensions.removeEventListener('change', handleDimensionsChange);
      isMounted = false; // set flag to false when component is unmounted
    };
  }, []);

  const loadOffers = () => {
    setIsLoading(true);
    NetworkLayer.getOffers(apiKey, environment, userAttributes)
      .then(response => {
        if (isMounted) {
          // check if component is still mounted before updating state
          const offers = response.data.data.offers;
          setNativeStyles(response.data.data.styles);

          if (offers && offers.length > 0) {
            setCarouselItems(offers);
            NetworkLayer.trackOfferView(apiKey, offers[0].pixel)
              .then(response => {
                console.log(`ad view tracked at index: 0`);
              })
              .catch(error => {
                console.log(`failed to track ad view: ${error} at index: 0`);
              });
          }
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.log(`getOffers API call failed: ${error}`);
        setIsLoading(false);
      });
  };

  const goToIndex = index => {
    scrollRef.current?.scrollToIndex({index});
  };

  const onPressCTA = (item, index) => {
    if (openLinkIn === LINK.inapp) {
      if (item && item.click_url) {
        setUrlToLoad(item.click_url);
        setModalVisible(true);
      }
    } else if (openLinkIn === LINK.external) {
      openURLInBrowser(item.click_url);
    }
  };

  const getCurrentIndex = () => {
    return scrollRef?.current?.getCurrentIndex();
  };

  const getPrevIndex = () => {
    return scrollRef?.current?.getPrevIndex();
  };

  const openURLInBrowser = url => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  const handleImageError = () => {
    setImageError(true);
  };
  const reloadOffers = () => {
    console.log('reload offers');
    loadOffers();
  };

  const renderCarouselItem = ({item, index}) => {
    const imageSource = item.image
      ? {uri: item.image}
      : item.creatives.find(creative => creative.is_primary === true)?.url ||
        require('../assets/placeholder.png');

    const MAX_LENGTH = 88;

    const truncateText = text => {
      if (text.length > MAX_LENGTH) {
        return `${text.substring(0, MAX_LENGTH)}...`;
      }
      return text;
    };
    const html = truncateText(item.description);

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={childStyle}
        onPress={() => {
          if (onPressItem) {
            onPressItem(item);
          }
        }}>
        <View style={sliderContainerStyle}>
          <View style={imageContainerStyle}>
            {imageError ? (
              <FastImage
                style={styles.imageStyle}
                source={require('../assets/placeholder.png')}
                resizeMode={FastImage.resizeMode.contain}
              />
            ) : (
              <FastImage
                defaultSource={require('../assets/placeholder.png')}
                source={imageSource}
                style={styles.imageStyle}
                resizeMode={FastImage.resizeMode.contain}
                onError={handleImageError}
              />
            )}
          </View>
          <View style={textsContainerStyle}>
            <View style={titleContainerStyle}>
              <Text numberOfLines={2} style={titleStyle}>
                {item.title}
              </Text>
            </View>
            <View style={styles.descriptionContainerStyle}>
              <RenderHtml
                contentWidth={carouselWidth * 0.7}
                source={{html: `<div>${html}</div>`}}
                tagsStyles={htmlStyles}
                baseFontStyle={baseFontStyle}
              />
            </View>
            <View style={ctaContainerStyle}>
              <TouchableOpacity
                style={ctaButtonStyle}
                onPress={() => {
                  onPressCTA(item, index);
                }}>
                <Text style={ctaTextStyle}>{item.cta_yes}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View
      style={
        carouselItems.length > 0 ? sliderContainerStyle : {display: 'none'}
      }>
      {carouselItems.length > 0 && (
        <View style={{flex: 1}}>
          <View
            style={{
              height: carouselHeight - paginationMinHeight,
            }}>
            {carouselWidth && carouselItemWidth && (
              <SnapCarousel
                data={carouselItems}
                layoutCardOffset={layoutCardOffset}
                layout={layout}
                renderItem={renderCarouselItem}
                sliderWidth={carouselHeight}
                itemWidth={carouselItemWidth}
                autoplay={autoPlay}
                autoplayDelay={autoPlayDelay}
                autoplayLoop={autoPlayLoop}
                loop={loop}
                enableSnap={true}
                activeSlideAlignment={'start'}
                inactiveSlideScale={0.6}
                inactiveSlideOpacity={0.6}
                containerCustomStyle={{overflow: 'visible'}}
                contentContainerCustomStyle={{overflow: 'visible'}}
                onSnapToItem={index => {
                  setCurrentIndex(index);
                  if (currentItem) {
                    currentItem(carouselItems[index]);
                  }
                  NetworkLayer.trackOfferView(
                    apiKey,
                    carouselItems[index].pixel,
                  )
                    .then(response => {
                      console.log(`ad view tracked at index: ${index}`);
                    })
                    .catch(error => {
                      console.log(
                        `failed to track ad view: ${error} at index: ${index}`,
                      );
                    });
                }}
              />
            )}
          </View>
          {showPagination && carouselItems.length > 0 && (
            // <View
            //   style={{
            //     flexDirection: 'row',
            //     height: paginationMinHeight,
            //     backgroundColor: 'red',
            //     alignItems: 'center',
            //     justifyContent: 'center',
            //   }}>
            <Pagination
              containerStyle={{
                marginTop: -20,
                height: paginationMinHeight,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              dotContainerStyle={{
                marginHorizontal: 5,
                height: dotStyle.height,
                width: dotStyle.width,
              }}
              dotsLength={carouselItems.length}
              activeDotIndex={currentIndex}
              dotColor={paginationActiveColor}
              dotStyle={dotStyle}
              inactiveDotColor={paginationDefaultColor}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
            // </View>
          )}
        </View>
      )}
      <WebViewModal
        url={urlToLoad}
        onClose={closeModal}
        modalVisible={modalVisible}
      />
      {isLoading && (
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color={DEFAULT_COLORS.paginationDefaultColor}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  descriptionContainerStyle: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  imageStyle: {
    borderRadius: 5,
    flex: 1,
  },
  image: {
    width: '100%', // specify the desired width of the image (in this case, 100% of the container)
    height: '100%', // specify the desired height of the image (in this case, 100% of the container)
    //backgroundColor: 'black',
  },
  loadingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default APXCarouselPlugin;
