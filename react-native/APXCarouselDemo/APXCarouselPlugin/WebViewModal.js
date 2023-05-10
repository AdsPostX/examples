import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {WebView} from 'react-native-webview';

function WebViewModal({url, onClose, modalVisible}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset isLoading state when modalVisible prop changes
    setIsLoading(true);
  }, [modalVisible]);

  const handleWebViewLoad = () => {
    setIsLoading(false);
  };

  return (
    <Modal transparent visible={modalVisible} animationType="slide">
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.modalContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              {/* Show loading indicator or progress bar */}
              <ActivityIndicator size="large" color="blue" />
            </View>
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            {/* Use the icon component with the desired icon name and style */}
            <Image
              source={require('../assets/cancel.png')}
              style={styles.closeButtonImage}
            />
          </TouchableOpacity>
          <WebView
            source={{uri: url}}
            style={styles.webView}
            onLoad={handleWebViewLoad}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonImage: {
    width: 40,
    height: 40,
    tintColor: 'black',
  },
  webView: {
    flex: 1,
  },
});

export default WebViewModal;
