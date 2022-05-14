import React, { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { theme } from '../state/theme';

import Home from './Home';
import Lists from './Lists';
import Calendar from './Calendar';

const Tab = createMaterialBottomTabNavigator();

export interface HomeScreenProps {
	navigation: NativeStackNavigationProp<any, any>;
}

/**
 * The main screen handler with bottom tab navigation.
 */
const MainScreen: React.FC<HomeScreenProps> = ({ navigation: _navigation }) => {
	auth().onAuthStateChanged((user) => {
		if (!user) {
			_navigation.replace('Login');
		}
	});

	return (
		<Tab.Navigator
			initialRouteName="Home"
			barStyle={{ backgroundColor: theme.colors.primary }}
			shifting
			screenOptions={({ route }) => ({
				tabBarIcon: ({ color }) => {
					let iconName = '';

					if (route.name === 'Home') {
						iconName = 'home';
					} else if (route.name === 'Lists') {
						iconName = 'format-list-bulleted';
					} else if (route.name === 'Calendar') {
						iconName = 'calendar-today';
					}

					return <MaterialIcons name={iconName} size={24} color={color} />;
				},
			})}>
			<Tab.Screen name="Home" component={Home} />

			<Tab.Screen name="Lists" component={Lists} />

			<Tab.Screen name="Calendar" component={Calendar} />
		</Tab.Navigator>
	);
};

export default MainScreen;
