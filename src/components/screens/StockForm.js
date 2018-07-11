import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet, Platform, AsyncStorage} from 'react-native';
import { Icon } from 'react-native-elements';
import config from '../../config';
import { LinearGradient } from 'expo';
import KeyboardSpacer from 'react-native-keyboard-spacer';

class StockForm extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Add a Stock',
    headerLeft:
    <Icon
      name={'chevron-left'}
      title="test"
      color="blue"
      onPress={() => navigation.navigate('portfolio', {refresh: true})}
    />
  });

  constructor(){
    super()
    this.state = {
      formFields: {
        stock: {
          'symbol': '',
          'quantity': ''
        }
      },
      formError: '',
      formSuccess: ''
    }
  }

  updateText(text, field) {
    let newState = Object.assign(this.state)
    newState.formFields.stock[field] = text;
    this.setState(newState);
  }

  async submitOwnedStock() {
    let authToken = await AsyncStorage.getItem('auth_token');
    let authEmail = await AsyncStorage.getItem('auth_email');
    await fetch(config.baseUrl + '/add_owned_stock', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-User-Token': authToken,
        'X-User-Email': authEmail
      },
      body: JSON.stringify(this.state.formFields)
    })
    .then( response => {
      if (!response.ok) { throw response }
      return response.json()  //we only get here if there is no error
    })
    .then( json => {
      let successMessage = "You've successfully added your " + json.symbol + " stock to your portfolio. You may continue to add stock here, or go back to your ";
      let newState = Object.assign(this.state);
      newState.formSuccess = successMessage;
      newState.formFields.stock = {
        'symbol': '',
        'quantity': ''
      }
      newState.formError   = "";
      this.setState(newState);
    })
    .catch(err => {
      err.json().then( jsonErr => {
        let responseError = (jsonErr.error === undefined) ? jsonErr.errors : jsonErr.error;
        let errorMessage = "";
        if(typeof responseError === "object"){
          Object.keys(responseError).forEach((key) => {
            errorMessage += "\n" + (key.charAt(0).toUpperCase() + key.slice(1)) + ' ' + responseError[key][0]
          });
          errorMessage = errorMessage.slice(1);
        } else {
          errorMessage = responseError;
        }
        let newState = Object.assign(this.state);
        newState.formError   = errorMessage;
        newState.formSuccess = "";
        this.setState(newState);
      })
    })
  }

  successContainer(){
    if(this.state.formSuccess !== ""){
      return(<Text style={{color: 'green', paddingHorizontal: 15, marginBottom: 10, width: 100+'%'}}>{this.state.formSuccess}
                <Text
                  style={{color: 'green', textDecorationLine: 'underline'}}
                  onPress={()=>{this.props.navigation.navigate('portfolio', {refresh: true})}}
                >
                  Portfolio
                </Text>
                .
              </Text>
            )
    }
  }

  render(){
    return(
      <View
        style={{
          height: 100+'%',
          width: 100+'%',
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={{marginBottom: 20, paddingHorizontal: 15, width: 100+'%'}}>
          {"Enter a stock that you own along with the number of shares of it you have. We will track your ongoing value for this investment."}
        </Text>
        {this.successContainer()}
        <Text style={{marginBottom: 5, paddingHorizontal: 10, color: 'red', textAlign: 'center'}}>{this.state.formError}</Text>
        <TextInput
          value={this.state.formFields.stock.symbol}
          onChangeText={
            (text)=>{this.updateText(text, 'symbol')}
          }
          textDecorationLine='none'
          suppressHighlighting={true}
          placeholderTextColor='#232323'
          underlineColorAndroid='rgba(0,0,0,0)'
          selectionColor='#232323'
          placeholder="Stock symbol"
          style={styles.input}
          autoCapitalize='characters'
        />
        <TextInput
          value={this.state.formFields.stock.quantity}
          onChangeText={
            (text)=>{this.updateText(text, 'quantity')}
          }
          placeholderTextColor='#232323'
          underlineColorAndroid='rgba(0,0,0,0)'
          selectionColor='#232323'
          placeholder="Number of shares you own"
          keyboardType="numeric"
          style={styles.input}
        />
        <TouchableOpacity style={styles.submitButton} onPress={()=>{this.submitOwnedStock()}}>
          <Text style={styles.submitButtonText}>{"Submit"}</Text>
        </TouchableOpacity>
        <KeyboardSpacer />
      </View>
    )
  }
}

export default StockForm

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: 85+'%',
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'whitesmoke',
    color: '#232323'
  },
  submitButton: {
    height: 50,
    width: 85+'%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#232323',
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitButtonText: {
    color: '#232323'
  }
})
