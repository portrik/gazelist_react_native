import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { Text, View, StyleSheet } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '../state/theme';

import { DAO, User } from '../model';

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
		width: '100%',
		paddingBottom: 10,
	},
	error: {
		color: 'red',
	},
	errorWrapper: {
		height: '10%',
	},
});

/**
 * Screen handling the signup procedure.
 */
const SignupScreen: React.FC<{
	navigation: NativeStackNavigationProp<any, any>;
}> = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	/**
	 * Handler for the Firebase Authentication signup.
	 */
	const _handleSignIn = async () => {
		try {
			if (email.trim().length < 1) {
				throw new Error('Email cannot be empty!');
			}

			if (password.length < 8) {
				throw new Error('Password must have at least 8 characters!');
			}

			const response = await auth().createUserWithEmailAndPassword(
				email.trim(),
				password,
			);

			const dao = new DAO('user');
			const id = await dao.getNewId();
			await dao.create(new User(id, response.user.email as string));

			navigation.replace('Main');
		} catch (err) {
			setError((err as Error).message);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Title>Create Account</Title>

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

				<Button mode="contained" onPress={_handleSignIn}>
					Create Account
				</Button>
			</View>
		</View>
	);
};

export default SignupScreen;
