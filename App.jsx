//
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import NfcManager, {NfcEvents, Ndef, NfcTech} from 'react-native-nfc-manager';
import QRCode from 'react-native-qrcode-svg';

const NfcTagReader = () => {
  const [nfcTag, setNfcTag] = useState(null);
  const [nfcTagData, setNfcTagData] = useState(null);

  useEffect(() => {
    const startNfc = async () => {
      try {
        await NfcManager.start();
        await NfcManager.requestTechnology(NfcManager.NfcTech.Ndef);
        NfcManager.setEventListener(NfcEvents.DiscoverTag, handleTagDiscovered);
      } catch (ex) {
        console.warn('error when starting NFC', ex);
      }
    };

    startNfc();

    return () => {
      NfcManager.cancelTechnologyRequest().catch(error => {
        console.log('Error cancelling NFC technology request:', error);
      });
    };
  }, []);

  const handleTagDiscovered = tag => {
    console.log('Tag Discovered', tag);
    setNfcTag(tag);
    readNfcTag(tag);
  };

  const readNfcTag = async tag => {
    try {
      const ndefTag = await NfcManager.getNdefMessage();
      console.log('NDEF Tag:', ndefTag);
      const ndefRecords = ndefTag.records;
      for (const record of ndefRecords) {
        if (record.tnf === Ndef.TNF_WELL_KNOWN && Ndef.uri.check(record)) {
          const url = Ndef.uri.decodePayload(record.payload);
          setNfcTagData(url);
        }
      }
    } catch (ex) {
      console.warn('Error reading NFC tag:', ex);
    }
  };

  const handleScanButtonPress = () => {
    Alert.alert(
      'Ready to Scan NFC Tag',
      'Tap your device to an NFC tag to read its data.',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={handleScanButtonPress}>
        <Text style={styles.scanButtonText}>Share my card</Text>
      </TouchableOpacity>
      <View style={styles.qrCodeContainer}>
        {nfcTagData ? (
          <QRCode
            value={nfcTagData}
            size={200}
            backgroundColor="#fff"
            color="#000"
          />
        ) : (
          <Text>QR code here</Text>
        )}
      </View>
      <View style={styles.cont2}>
        <Text style={styles.text}>Share my card</Text>
        <Text style={styles.text}>Add card to wallet</Text>
        <Text style={styles.text}>Add card to homescreen</Text>
        <Text style={styles.text}>Create Email Signature</Text>
        <Text style={styles.text}>Create virtual backgroud</Text>
      </View>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={handleScanButtonPress}>
        <Text style={styles.scanButtonText}>Share with Airdrop</Text>
      </TouchableOpacity>
      {nfcTagData ? (
        <View>
          <Text style={styles.title}>NFC Tag Data</Text>
          <Text style={styles.content}>{nfcTagData}</Text>
        </View>
      ) : (
        <Text style={styles.title}>Waiting for NFC Tag...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scanButton: {
    backgroundColor: '#ed8c42',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 20,
    height: 40,
    width: 260,
    borderRadius: 40,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cont2: {
    alignSelf: 'center',
    flexDirection: 'column',
    // justifyContent:'center',
    alignItems: 'flex-start',
    backgroundColor: '#ebe2e1',
    padding: 10,
    height: 240,
    width: 350,
    borderRadius: 20,
    marginTop: 10,
  },
  text: {
    color: 'gray',
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  title: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 18,
    marginBottom: 10,
  },
  qrCodeContainer: {
    alignSelf: 'center',
    margin: 12,
  },
});

export default NfcTagReader;
