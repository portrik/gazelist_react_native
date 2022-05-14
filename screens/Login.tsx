import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { Text, View, StyleSheet } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '../state/theme';

const styles = StyleSheet.create({
	container: {
		padding: 20,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '100%',
		flex: 1,
	},
	content: {
		width: '100%',
		height: '100%',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-around',
		alignContent: 'space-around',
	},
	signup: {
		paddingBottom: 10,
		textAlign: 'center',
		width: '100%',
	},
	error: {
		color: 'red',
	},
	errorWrapper: {
		height: '10%',
	},
});

/**
 * Screen handling the login procedure and navigation to signup.
 */
const LoginScreen: React.FC<{
	navigation: NativeStackNavigationProp<any, any>;
}> = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	/**
	 * Handles the login procedure with Firebase Authentication.
	 */
	const _handleLogin = async () => {
		try {
			if (email.trim().length < 1) {
				throw new Error('Email cannot be empty!');
			}

			if (password.length < 8) {
				throw new Error('Password must be at least 8 characters long!');
			}

			await auth().signInWithEmailAndPassword(email.trim(), password);

			navigation.replace('Main');
		} catch (err) {
			setError((err as Error).message);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Title>GazeList Login</Title>

				<TextInput
					label="Email"
					returnKeyType="next"
					value={email}
					onChangeText={(text) => setEmail(text)}
					error={error.trim().length > 1}
					autoCapitalize="none"
					autoComplete="email"
					textContentType="emailAddress"
					keyboardType="email-address"
					mode="outlined"
					activeOutlineColor={theme.colors.text}
				/>

				<TextInput
					label="Password"
					returnKeyType="done"
					value={password}
					onChangeText={(text) => setPassword(text)}
					error={error.trim().length > 1}
					secureTextEntry
					mode="outlined"
					activeOutlineColor={theme.colors.text}
				/>

				<View style={styles.errorWrapper}>
					{error.trim().length > 0 && <Text style={styles.error}>{error}</Text>}
				</View>

				<Button mode="contained" onPress={_handleLogin}>
					Login
				</Button>

				<View>
					<View style={styles.signup}>
						<Text>Don't have an account?</Text>
					</View>

					<Button
						mode="outlined"
						onPress={() => navigation.navigate('Signup')}
						labelStyle={{ color: theme.colors.text }}>
						<Text>Sign up</Text>
					</Button>
				</View>
			</View>
		</View>
	);
};

export default LoginScreen;
