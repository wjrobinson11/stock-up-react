import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet, Platform } from 'react-native';
import config from '../../config';
import { LinearGradient } from 'expo';
import KeyboardSpacer from 'react-native-keyboard-spacer';

class Register extends Component {
  constructor(){
    super()
    this.state = {
      credentials: {
        user: {
          'email': '',
          'password': ''
        },
        formError: ''
      }
    }
  }

  updateText(text, field) {
    let newState = Object.assign(this.state)
    newState.credentials.user[field] = text
    this.setState(newState);
  }

  register() {
    let success = null;
    fetch(config.baseUrl + '/users', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.credentials)
    })
    .then( response => {
      console.log(response.ok);
      if (!response.ok) { throw response }
      return response.json()  //we only get here if there is no error
    })
    .then( json => {
      // Store auth token later
      let auth_token = json.authentication_token;

      this.props.navigation.navigate('main');
    })
    .catch( err => {
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
        newState.formError = errorMessage;
        this.setState(newState);
      })
    })
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
        <Text style={{fontSize: 50, color: '#232323', marginBottom: 50}}>Stock Up</Text>
        <Text style={{marginBottom: 5, color: '#232323', textAlign: 'center'}}>{this.state.formError}</Text>
        <TextInput
          value={this.state.credentials.user.email}
          onChangeText={
            (text)=>{this.updateText(text, 'email')}
          }
          textDecorationLine='none'
          suppressHighlighting={true}
          placeholderTextColor='#232323'
          underlineColorAndroid='rgba(0,0,0,0)'
          selectionColor='#232323'
          placeholder="Email"
          autoCapitalize='none'
          style={styles.input}
        />
        <TextInput
          value={this.state.credentials.user.password}
          onChangeText={
            (text)=>{this.updateText(text, 'password')}
          }
          secureTextEntry
          placeholderTextColor='#232323'
          underlineColorAndroid='rgba(0,0,0,0)'
          selectionColor='#232323'
          placeholder="Password"
          style={styles.input}
        />
        <TouchableOpacity style={styles.submitButton} onPress={()=>{this.register()}}>
          <Text style={styles.submitButtonText}>{"Sign up"}</Text>
        </TouchableOpacity>
          <Text style={{color: '#232323'}}>{"Don't have an account yet?"}</Text>
        <TouchableOpacity
          onPress={()=>{this.props.navigation.navigate('login')}}
        >
          <Text style={{color: '#232323', fontWeight: 'bold'}}>{"Sign in"}</Text>
        </TouchableOpacity>
        <KeyboardSpacer />
      </View>
    )
  }
}

export default Register

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
