import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import { MainFeed, Login, Portfolio, Profile, Register, StockForm, StockFormEdit } from './components/screens';
import { createSwitchNavigator, createBottomTabNavigator, createStackNavigator, createDrawerNavigator } from 'react-navigation';

const IntroStack = createSwitchNavigator({
  login: Login,
  register: Register,
},
{
  headerMode: 'none'
})
const MainStack = createSwitchNavigator({
  //main: {screen: ({navigation}) => <Tabs screenProps={{ rootNavigation: navigation }} />},
  main: {screen: ({navigation}) => <PortfolioStack screenProps={{ rootNavigation: navigation }} />},
  login: IntroStack,
})

const Tabs = createBottomTabNavigator({
  portfolio: {screen: ({screenProps}) => <PortfolioStack screenProps={{ rootNavigation: screenProps.rootNavigation }} />},
  feed: MainFeed,
  profile: Profile
})

const PortfolioStack = createStackNavigator({
  portfolio: Portfolio,
  stockForm: StockForm,
  stockFormEdit: StockFormEdit,
})

class StockUp extends Component {
  render(){
    return(
      // <MainStack />
      <MainStack />
    )
  }
}

export default StockUp
