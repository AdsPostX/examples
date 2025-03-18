import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  REGULAR_ACCOUNTID_KEY,
  MODAL_ACCOUNTID_KEY,
  INTERSTITIAL_ACCOUNTID_KEY,
  STANDALONE_ACCOUNTID_KEY,
  MODAL_THEMEID_KEY,
  INTERSTITIAL_THEMEID_KEY,
  STANDALONE_THEMEID_KEY,
  MODAL_CID_KEY,
  INTERSTITIAL_CID_KEY,
  STANDALONE_CID_KEY,
} from '../util/constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import Config from 'react-native-config';

const SettingsScreen = ({navigation}) => {
  // State variables initialized with default values
  const [regularAccountId, setRegularAccountId] = useState(
    Config.DEFAULT_ACCOUNTID,
  );
  const [modalAccountId, setModalAccountId] = useState(
    Config.DEFAULT_ACCOUNTID,
  );
  const [interstitialAccountId, setInterstitialAccountId] = useState(
    Config.DEFAULT_ACCOUNTID,
  );
  const [standaloneAccountId, setStandaloneAccountId] = useState(
    Config.DEFAULT_ACCOUNTID,
  );

  const [modalThemeId, setModalThemeId] = useState(
    Config.DEFAULT_MODAL_THEMEID,
  );
  const [interstitialThemeId, setInterstitialThemeId] = useState(
    Config.DEFAULT_INTERSTITIAL_THEMEID,
  );
  const [standaloneThemeId, setStandaloneThemeId] = useState(
    Config.DEFAULT_STANDALONE_THEMEID,
  );

  const [modalcId, setModalcId] = useState(Config.DEFAULT_CID);
  const [interstitialcId, setInterstitialcId] = useState(Config.DEFAULT_CID);
  const [standalonecId, setStandalonecId] = useState(Config.DEFAULT_CID);

  const country = Config.DEFAULT_COUNTRY;

  // Load saved settings when the component mounts
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const values = await AsyncStorage.multiGet([
          REGULAR_ACCOUNTID_KEY,
          MODAL_ACCOUNTID_KEY,
          INTERSTITIAL_ACCOUNTID_KEY,
          STANDALONE_ACCOUNTID_KEY,
          MODAL_THEMEID_KEY,
          INTERSTITIAL_THEMEID_KEY,
          STANDALONE_THEMEID_KEY,
          MODAL_CID_KEY,
          INTERSTITIAL_CID_KEY,
          STANDALONE_CID_KEY,
        ]);

        const settings = Object.fromEntries(values);

        setRegularAccountId(
          settings.regularAccountId || Config.DEFAULT_ACCOUNTID,
        );
        setModalAccountId(settings.modalAccountId || Config.DEFAULT_ACCOUNTID);
        setInterstitialAccountId(
          settings.interstitialAccountId || Config.DEFAULT_ACCOUNTID,
        );
        setStandaloneAccountId(
          settings.standaloneAccountId || Config.DEFAULT_ACCOUNTID,
        );
        setModalThemeId(settings.modalThemeId || Config.DEFAULT_MODAL_THEMEID);
        setInterstitialThemeId(
          settings.interstitialThemeId || Config.DEFAULT_INTERSTITIAL_THEMEID,
        );
        setStandaloneThemeId(
          settings.standaloneThemeId || Config.DEFAULT_STANDALONE_THEMEID,
        );
        setModalcId(settings.modalcId || Config.DEFAULT_CID);
        setInterstitialcId(settings.interstitialcId || Config.DEFAULT_CID);
        setStandalonecId(settings.standalonecId || Config.DEFAULT_CID);
      } catch (error) {
        Alert.alert('Error', 'Failed to load settings');
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async () => {
    const errors = [];

    if (!regularAccountId)
      errors.push('Regular Perkswall Account ID is required.');
    if (!modalAccountId) errors.push('Modal Perkswall Account ID is required.');
    if (!interstitialAccountId)
      errors.push('Interstitial Perkswall Account ID is required.');
    if (!standaloneAccountId)
      errors.push('Standalone Perkswall Account ID is required.');
    if (!modalThemeId) errors.push('Modal Perkswall Theme ID is required.');
    if (!interstitialThemeId)
      errors.push('Interstitial Perkswall Theme ID is required.');
    if (!standaloneThemeId)
      errors.push('Standalone Perkswall Theme ID is required.');
    if (!modalcId) errors.push('Modal Perkswall c_id is required.');
    if (!interstitialcId)
      errors.push('Interstitial Perkswall c_id is required.');
    if (!standalonecId) errors.push('Standalone Perkswall c_id is required.');

    if (errors.length > 0) {
      Alert.alert('Error', errors.join('\n'));
      return;
    }

    try {
      await AsyncStorage.multiSet([
        [REGULAR_ACCOUNTID_KEY, regularAccountId],
        [MODAL_ACCOUNTID_KEY, modalAccountId],
        [INTERSTITIAL_ACCOUNTID_KEY, interstitialAccountId],
        [STANDALONE_ACCOUNTID_KEY, standaloneAccountId],
        [MODAL_THEMEID_KEY, modalThemeId],
        [INTERSTITIAL_THEMEID_KEY, interstitialThemeId],
        [STANDALONE_THEMEID_KEY, standaloneThemeId],
        [MODAL_CID_KEY, modalcId],
        [INTERSTITIAL_CID_KEY, interstitialcId],
        [STANDALONE_CID_KEY, standalonecId],
      ]);
      Alert.alert('Success', 'Settings saved');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Regular Perkswall</Text>
        <Text>Account ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Account ID"
          placeholderTextColor={'grey'}
          value={regularAccountId}
          onChangeText={setRegularAccountId}
        />
        <Text>Country</Text>
        <TextInput
          style={styles.input}
          placeholder="Country"
          placeholderTextColor={'grey'}
          value={country}
          editable={false}
        />
        <View style={styles.switchContainer}>
          <Text>Standalone</Text>
          <Switch value={false} editable={false} />
        </View>

        <Text style={styles.title}>Modal Style Perkswall</Text>
        <Text>Account ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Account ID"
          placeholderTextColor={'grey'}
          value={modalAccountId}
          onChangeText={setModalAccountId}
        />
        <Text>Theme ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Theme ID"
          placeholderTextColor={'grey'}
          value={modalThemeId}
          onChangeText={setModalThemeId}
        />
        <Text>c_id</Text>
        <TextInput
          style={styles.input}
          placeholder="c_id"
          placeholderTextColor={'grey'}
          value={modalcId}
          onChangeText={setModalcId}
        />
        <Text>Country</Text>
        <TextInput
          style={styles.input}
          placeholder="Country"
          placeholderTextColor={'grey'}
          value={country}
          editable={false}
        />
        <View style={styles.switchContainer}>
          <Text>Standalone</Text>
          <Switch value={false} editable={false} />
        </View>

        <Text style={styles.title}>Interstitial Style Perkswall</Text>
        <Text>Account ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Account ID"
          placeholderTextColor={'grey'}
          value={interstitialAccountId}
          onChangeText={setInterstitialAccountId}
        />
        <Text>Theme ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Theme ID"
          placeholderTextColor={'grey'}
          value={interstitialThemeId}
          onChangeText={setInterstitialThemeId}
        />
        <Text>c_id</Text>
        <TextInput
          style={styles.input}
          placeholder="c_id"
          placeholderTextColor={'grey'}
          value={interstitialcId}
          onChangeText={setInterstitialcId}
        />
        <Text>Country</Text>
        <TextInput
          style={styles.input}
          placeholder="Country"
          placeholderTextColor={'grey'}
          value={country}
          editable={false}
        />
        <View style={styles.switchContainer}>
          <Text>Standalone</Text>
          <Switch value={false} editable={false} />
        </View>

        <Text style={styles.title}>Standalone Style Perkswall</Text>
        <Text>Account ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Account ID"
          placeholderTextColor={'grey'}
          value={standaloneAccountId}
          onChangeText={setStandaloneAccountId}
        />
        <Text>Theme ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Theme ID"
          placeholderTextColor={'grey'}
          value={standaloneThemeId}
          onChangeText={setStandaloneThemeId}
        />
        <Text>c_id</Text>
        <TextInput
          style={styles.input}
          placeholder="c_id"
          placeholderTextColor={'grey'}
          value={standalonecId}
          onChangeText={setStandalonecId}
        />
        <Text>Country</Text>
        <TextInput
          style={styles.input}
          placeholder="Country"
          placeholderTextColor={'grey'}
          value={country}
          editable={false}
        />
        <View style={styles.switchContainer}>
          <Text>Standalone</Text>
          <Switch value={true} editable={false} />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Save" onPress={saveSettings} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 24,
  },
});

export default SettingsScreen;
