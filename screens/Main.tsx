import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Home from './Home';
import Lists from './Lists';
import Calendar from './Calendar';

const Tab = createMaterialBottomTabNavigator();

export interface HomeScreenProps {
	navigation: NativeStackNavigationProp<any, any>;
}

const MainScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
	return (
		<Tab.Navigator
			initialRouteName="Home"
			screenOptions={({ route }) => ({
				tabBarIcon: ({ color }) => {
					let iconName;

					if (route.name === 'Home') {
						iconName = 'home';
					} else if (route.name === 'Lists') {
						iconName = 'format-list-bulleted';
					} else if (route.name === 'Calendar') {
						iconName = 'calendar-today';
					}

					return <MaterialIcons name={iconName} color={color} />;
				},
			})}>
			<Tab.Screen name="Home" component={Home} />

			<Tab.Screen name="Lists" component={Lists} />

			<Tab.Screen name="Calendar" component={Calendar} />
		</Tab.Navigator>
	);
};

export default MainScreen;
