import React from 'react';
import { Document, Page, View, Text, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer';

// Register Bengali fonts
Font.register({
  family: 'Kalpurush',
  src: 'https://cdn.jsdelivr.net/gh/sh4hids/bangla-web-fonts@0.4/fonts/kalpurush/Kalpurush.ttf',
});

Font.register({
  family: 'SolaimanLipi',
  src: 'https://cdn.jsdelivr.net/gh/sh4hids/bangla-web-fonts@0.4/fonts/solaimanlipi/SolaimanLipi.ttf',
});

const styles = StyleSheet.create({
  viewer: {
    width: '100%',
    height: '100%',
  },
  page: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: '10mm',
    backgroundColor: '#ffffff',
    fontFamily: 'Kalpurush',
  },
  card: {
    width: '50%',
    padding: '5mm',
    boxSizing: 'border-box',
  },
  cardContent: {
    border: '1pt solid black',
    padding: '5mm',
    margin: '2mm',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '3mm',
    fontSize: 12,
    fontFamily: 'Kalpurush',
  },
  text: {
    fontSize: 12,
    marginBottom: '2mm',
    fontFamily: 'Kalpurush',
  },
  bold: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: '3mm',
    fontFamily: 'Kalpurush',
  },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 12,
    marginBottom: '2mm',
    fontFamily: 'Kalpurush',
  }
});

const AddressCard = ({ code, muhtamimName, madrasahName, address, mobile }) => (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      <View style={styles.header}>
        <Text style={styles.text}>মুহতামিম,</Text>
        <Text style={styles.text}>কোড নং- {code}</Text>
      </View>
      <Text style={styles.text}>{muhtamimName}</Text>
      <Text style={styles.bold}>{madrasahName}</Text>
      <View style={styles.addressRow}>
        <Text>গ্রাম/মহল্লা: {address.village}</Text>
        <Text>ডাক: {address.policeStation}</Text>
      </View>
      <View style={styles.addressRow}>
        <Text>থানা: {address.policeStation}</Text>
        <Text>জেলা: {address.district}</Text>
      </View>
      <Text style={styles.text}>মোবাইল: {mobile}</Text>
    </View>
  </View>
);

const AddressCardsPrint = ({ madrasahs }) => {
  // Use demo data if no madrasahs provided
  const demoMadrasahs = [
    {
      id: 1,
      code: '100001',
      name: 'দারুল উলূম মাদরাসা',
      muhtamimName: 'মাওলানা আব্দুল করিম',
      village: 'নালিতাবাড়ী',
      policeStation: 'মুক্তাগাছা',
      district: 'ময়মনসিংহ',
      mobile: '01522584728'
    },
    {
      id: 2,
      code: '100002',
      name: 'আল-আমিন মাদরাসা',
      muhtamimName: 'মাওলানা রফিকুল ইসলাম',
      village: 'পাইকপাড়া',
      policeStation: 'মিরপুর',
      district: 'ঢাকা',
      mobile: '01812345678'
    },
    {
      id: 3,
      code: '100003',
      name: 'নূরুল ইসলাম মাদরাসা',
      muhtamimName: 'মাওলানা নূর আহমদ',
      village: 'টেকনাফ সদর',
      policeStation: 'টেকনাফ',
      district: 'কক্সবাজার',
      mobile: '01912345678'
    }
  ];

  const dataToUse = madrasahs?.length > 0 ? madrasahs : demoMadrasahs;

  return (
    <div style={{ 
      width: '210mm',  // A4 width
      margin: '0 auto',
      padding: '10mm',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '5mm',
      justifyContent: 'space-between'
    }}>
      {dataToUse.map((madrasah) => (
        <div key={madrasah.id} style={{ 
          width: 'calc(50% - 2.5mm)',
          marginBottom: '0mm',
          padding: '4mm',
          border: '2px solid #000',
          pageBreakInside: 'avoid',
          boxSizing: 'border-box',
          fontSize: '11pt'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3mm' }}>
            <span style={{ fontSize: '11pt' }}>মুহতামিম,</span>
            <span style={{ fontSize: '11pt' }}>কোড নং- {madrasah.code}</span>
          </div>
          <div style={{ fontSize: '11pt', marginBottom: '2mm' }}>{madrasah.muhtamimName}</div>
          <div style={{ fontSize: '12pt', fontWeight: 'bold', margin: '3mm 0' }}>{madrasah.name}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2mm 0' }}>
            <span style={{ fontSize: '11pt' }}>গ্রাম/মহল্লা: {madrasah.village}</span>
            <span style={{ fontSize: '11pt' }}>ডাক: {madrasah.policeStation}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2mm 0' }}>
            <span style={{ fontSize: '11pt' }}>থানা: {madrasah.policeStation}</span>
            <span style={{ fontSize: '11pt' }}>জেলা: {madrasah.district}</span>
          </div>
          <div style={{ fontSize: '11pt' }}>মোবাইল: {madrasah.mobile}</div>
        </div>
      ))}
    </div>
  );
};

export default AddressCardsPrint;
