import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, AsyncStorage } from 'react-native';
import config from '../../config';

const numColumns = 1;

class Portfolio extends Component {
  static navigationOptions = {
    title: 'Portfolio',
    headerTitleStyle :{textAlign: 'center',alignSelf:'center'},
    headerStyle:{
      backgroundColor:'white',
      borderBottomColor: '#E9E9EF'
    },
  };

  constructor(){
    super()
    this.state = {
      isLoading: true,
      isRequesting: false,
      summary: {
        total_value: ''
      },
      data: []
    }
  }

  async _requestOwnedStocks(){
    let authToken = await AsyncStorage.getItem('auth_token');
    let authEmail = await AsyncStorage.getItem('auth_email');
    fetch(
      config.baseUrl + '/owned_stocks', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-User-Token': authToken,
        'X-User-Email': authEmail
      }
    })
    .then( response => {
      if (!response.ok) { throw response }
      return response.json();
    })
    .then( json => {
      let newState = Object.assign(this.state);
      newState.summary.total_value = json["summary"]["total_value"];
      newState.data = json["stocks"];
      newState.isLoading = false;
      if (!this.state.isRequesting){
        newState.isRequesting = true;
        setTimeout(()=>{
          this._requestOwnedStocks();
          let newState = Object.assign(this.state);
          newState.isRequesting = false;
        }, 10000)
      }
      this.setState(newState);
    })
    .catch( err => {
      if(err.status === 401){
        console.log('back to login');
        this.props.screenProps.rootNavigation.navigate('login');
      }
    })
    this.state.isRequesting = false;
  }

  componentWillReceiveProps(nextProps) {
    this._requestOwnedStocks();
  }

  componentDidMount(){
    this._requestOwnedStocks();
  }

  investmentsContent() {
    if(this.state.data.length > 0){
      return (
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          ListHeaderComponent={this.renderHeader}
          numColumns={numColumns}
          stickyHeaderIndices={[0]}
          keyExtractor={(item, index) => index.toString()}
        />
      );
    } else {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
          <Text style={{fontSize: 16, textAlign: 'center'}}>{"Add stocks you own here, and we'll track everything for you."}</Text>
          <TouchableOpacity
            style={{backgroundColor: '#52bf90', padding: 10, marginTop: 5}}
            onPress={()=>{this.props.navigation.navigate('stockForm')}}
          >
            <Text style={{fontWeight: 'bold', color: 'white'}}>Add a stock</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  renderHeader(){
    return(
      <View style={{width: 100+'%', flexDirection: 'row', paddingHorizontal: 3, backgroundColor: 'white', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E9E9EF'}}>
        <View style={{width: 50+'%'}}>
          <Text style={{textAlign: 'left', fontSize: 10, color: 'grey' }}>{"Ticker Symbol"}</Text>
        </View>
        <View style={{width: 25+'%'}}>
          <Text style={{textAlign: 'right', fontSize: 10, color: 'grey' }}>{"Last Price"}</Text>
        </View>
        <View style={{width: 25+'%'}}>
          <Text style={{textAlign: 'right', fontSize: 10, color: 'grey' }}>{"Change"}</Text>
        </View>
      </View>
    )
  }

  renderItem = ({item, index}) => {
    let daily_price_change_str = null;
    let statusColor = null;
    if(item.daily_price_change > 0){
      daily_price_change_str = '+' + item.daily_price_change;
      daily_percentage_change_str = '+' + item.daily_percentage_change;
      statusColor = 'green';
    } else {
      if(item.daily_price_change < 0) {
        daily_price_change_str = item.daily_price_change;
        daily_percentage_change_str = item.daily_percentage_change;
        statusColor = 'red';
      } else {
        daily_price_change_str = 0;
        daily_percentage_change_str = 0;
        statusColor = 'grey';
      }
    }
    return (
      <TouchableOpacity
        style={styles.stockGrid}
        onPress={()=>{this.props.navigation.navigate('stockFormEdit', {stockUserLinkId: item.stock_user_link_id, symbol: item.symbol, quantity: item.quantity})}}
      >
        <View style={{width: 50+'%'}}>
          <Text style={{textAlign: 'left' }}>{item.symbol} ({item.quantity})</Text>
          <Text style={{textAlign: 'left', fontSize: 10, color: 'grey'}}>{item.company}</Text>
        </View>
        <View style={{width: 25+'%'}}>
          <Text style={{textAlign: 'right' }}>{item.current_price}</Text>
        </View>
        <View style={{width: 25+'%'}}>
          <Text style={{textAlign: 'right', color: statusColor}}>{daily_price_change_str}</Text>
          <Text style={{textAlign: 'right', color: statusColor, fontSize: 10}}>{item.daily_percentage_change}%</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render(){
    if(this.state.isLoading) {
      return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading...</Text>
      </View>
    }

    return(
      <View style={{flex: 1, backgroundColor: '#E9E9EF'}}>
        <View
          style={{
            backgroundColor:'white',
            alignItems: 'center',
            justifyContent:'center',
            borderBottomColor: '#E9E9EF',
            borderBottomWidth: StyleSheet.hairlineWidth,
            paddingTop: 30,
            paddingBottom: 20
          }}>
          <Text style={{fontSize: 40}}>{this.state.summary.total_value}</Text>
          <Text style={{fontSize: 18}}>{""}</Text>
        </View>
        <View
          style={{
            backgroundColor:'#E9E9EF',
            borderBottomColor: '#E9E9EF',
            borderBottomWidth: StyleSheet.hairlineWidth,
            padding: 5,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
          <Text style={{fontSize: 18}}>{"Investments"}</Text>
          <TouchableOpacity
            style={{marginTop: -10, marginBottom: -10, width: 40, height: 40, borderRadius: 40, justifyContent: 'center', alignItems: 'center'}}
            onPress={()=>{this.props.navigation.navigate('stockForm')}}
          >
            <Text style={{color: 'green', fontSize: 30}}>{"+"}</Text>
          </TouchableOpacity>
        </View>
        {this.investmentsContent()}
      </View>
    )
  }
}

export default Portfolio

const styles = StyleSheet.create({
  stockGrid: {
    backgroundColor: 'white',
    borderColor: '#E9E9EF',
    borderWidth: StyleSheet.hairlineWidth,
    width: 100+'%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    alignItems: 'center'
  }
});
