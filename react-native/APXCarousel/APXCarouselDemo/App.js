import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Dimensions,
  FlatList,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import APXCarouselPlugin from './APXCarouselPlugin/APXCarouselPlugin';
import {
  DEFAULT_COLORS,
  ENVIRONMENT,
  LAYOUT,
  LINK,
} from './APXCarouselPlugin/Constants';

const IMAGES = [
  require('./assets/image1.jpg'),
  require('./assets/image2.jpg'),
  require('./assets/image3.jpg'),
  require('./assets/image4.jpg'),
  require('./assets/image5.jpg'),
];

const ITEM_DATA = new Array(50).fill(null).map((_, index) => ({
  id: index,
  imageIndex: index % IMAGES.length,
}));

function Item({imageIndex, windowWidth}) {
  const itemStyle = {
    height: windowWidth / 3,
    width: windowWidth / 3,
    borderColor: DEFAULT_COLORS.borderColor,
    margin: 2,
  };

  return (
    <View style={itemStyle} key={imageIndex}>
      <Image source={IMAGES[imageIndex]} style={styles.image} />
    </View>
  );
}

function App() {
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get('window').width,
  );
  const [windowHeight, setWindowHeight] = useState(
    Dimensions.get('window').height,
  );

  const apiKey = 'f0f16460-f739-4ec0-b220-b31745a78b3b';
  const userAttributes = {firstname: 'john', lastname: 'dev'};

  const renderItem = ({item}) => (
    <Item windowWidth={windowWidth} imageIndex={item.imageIndex} />
  );

  const handleCurrentItem = item => {
    console.log(`currently displayed Item: ${item.title}`);
  };

  const handlePressItem = item => {
    console.log(`selected item: ${item.title}`);
  };

  const handleDimensionsChange = dimensions => {
    setWindowWidth(dimensions.window.width);
    setWindowHeight(dimensions.window.height);
  };

  useEffect(() => {
    Dimensions.addEventListener('change', handleDimensionsChange);
    return () => {
      Dimensions.removeEventListener('change', handleDimensionsChange);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <APXCarouselPlugin
            layout={LAYOUT.stack}
            layoutCardOffset={20}
            environment={ENVIRONMENT.test}
            apiKey={apiKey}
            userAttributes={userAttributes}
            autoPlay={true}
            loop={true}
            autoPlayDelay={3.0}
            autoPlayLoop={false}
            showPagination={true}
            paginationActiveColor={DEFAULT_COLORS.paginationActiveLightColor}
            paginationDefaultColor={DEFAULT_COLORS.paginationDefaultColor}
            currentItem={handleCurrentItem}
            onPressItem={handlePressItem}
            openLinkIn={LINK.inapp}
            contentAlignment={'left'}
          />
        }
        ListFooterComponent={
          <APXCarouselPlugin
            layout={LAYOUT.tinder}
            layoutCardOffset={20}
            environment={ENVIRONMENT.live}
            apiKey={apiKey}
            userAttributes={userAttributes}
            sliderHeight={210}
            loop={true}
            showPagination={false}
            paginationActiveColor={DEFAULT_COLORS.paginationActiveLightColor}
            paginationDefaultColor={DEFAULT_COLORS.paginationDefaultColor}
            currentItem={handleCurrentItem}
            onPressItem={handlePressItem}
            openLinkIn={LINK.external}
            contentAlignment={'center'}
          />
        }
        data={ITEM_DATA}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.contentContainer}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DEFAULT_COLORS.AppBackgroundColor,
    padding: 2,
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
  },
});

export default App;
