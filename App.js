import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, TextInput, Image, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';


export default function App() {
  const [conversionRates, setConversionRates] = useState({rates: {loading: '0'}});
  const [currencyCodes, setCurrencyCodes] = useState(['loading']);
  const [selectedCurrency, setSelectedCurrency] = useState("Loading");
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('')

  const getCurrencyRates = () => { 
    fetch('https://api.exchangeratesapi.io/latest')
    .then(response => response.json())
    .then(data => {
      setConversionRates(data);
      console.log('rates: ', conversionRates);
      setCurrencyCodes(Object.keys(data.rates));
      console.log('codes: ', currencyCodes);
      setSelectedCurrency('USD')
    })
    .catch((error) => { 
      Alert.alert('Error', error.message);
    }); 
  }

  useEffect(() => getCurrencyRates(), [])

  const calculateResult = () => {
    let floatAmount = parseFloat(amount);
    if(isNaN(floatAmount)) {
      Alert.alert('Please enter a valid number')
    } else {
      let preciseResult = floatAmount * parseFloat(conversionRates.rates[selectedCurrency]);
      setResult(`${preciseResult.toFixed(2)}`);
    }
  }
  
  return (
    <View style={styles.container}>
      <Image style={{height: 176, width: 291}} source={require('./images/euro.png')}></Image>
      <Text style={styles.header}>Euro Converter</Text>
      <Text style={styles.hint}>Conversion rates loaded on app start. Currently only possible to convert from Euro. Use period "." as decimal separator.</Text>
      <View style={styles.input}>
        <TextInput 
          style={{width: 100, height: 30, borderColor: 'gray', borderWidth: 1, marginBottom: 5 }} 
          value={amount} 
          placeholder="Amount"
          onChangeText={(amount) => {
            setAmount(amount)
            
          } 
          }
        />
        <Text> EUR </Text>
        <Button onPress={calculateResult} title={'Calculate'}></Button>
      </View>
      <Picker
        selectedValue={selectedCurrency}
        style={{ height: 40, width: 100 }}
        onValueChange={(itemValue) => { 
            setSelectedCurrency(itemValue);
        }}>
        {currencyCodes.map(code => (<Picker.Item label={code} value={code} key={code} />))}
        {console.log('codesInPicker: ', currencyCodes)}
        {console.log('codeInPicker: ', selectedCurrency)}
        {console.log('selectedRate: ', conversionRates.rates[selectedCurrency])}
      </Picker>
      <Text>Exchange rate is: {conversionRates.rates[selectedCurrency]} </Text>
      <Text style={{fontSize: 20}}>Result: {result}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '5%',
    marginRight: '5%',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 15,
    fontStyle: 'italic',
  },
  input: {
    flexDirection:'row', 
    alignItems:'center',
    marginTop: 10,
    marginBottom: 10,
  },
});