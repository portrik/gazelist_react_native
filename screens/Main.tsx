import React from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import Home from './Home';
import Lists from './Lists';
import Calendar from './Calendar';

const Tab = createMaterialBottomTabNavigator();

export interface HomeScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

const MainScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Lists" component={Lists} />
      <Tab.Screen name="Calendar" component={Calendar} />
    </Tab.Navigator>
  );
};

export default MainScreen;
