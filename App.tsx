import { Provider } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { theme } from './state/theme';

import Camera from './screens/Camera';
import Main from './screens/Main';
import List from './screens/TaskList';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Task from './screens/Task';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
	const [initializing, setInitializing] = useState(true);
	const [_user, setUser] = useState<FirebaseAuthTypes.User | null>();

	useEffect(() => {
		auth().onAuthStateChanged((newUser) => {
			setUser(newUser);

			if (initializing) {
				setInitializing(false);
			}
		});
	}, []);

	return (
		<Provider theme={theme}>
			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{ headerShown: false }}
					initialRouteName="Main">
					<Stack.Screen name="Camera" component={Camera} />
					<Stack.Screen name="Login" component={Login} />
					<Stack.Screen name="Signup" component={Signup} />
					<Stack.Screen name="Task" component={Task} />
					<Stack.Screen name="Main" component={Main} />
					<Stack.Screen name="List" component={List} />
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
	);
};

export default App;
