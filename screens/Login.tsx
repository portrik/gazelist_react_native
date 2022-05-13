import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Text, TouchableOpacity, View} from 'react-native';
import {TextInput, Button} from 'react-native-paper';

const LoginScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, any>;
}> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
    <>
      <Text>Login</Text>

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email}
        onChangeText={text => setEmail(text)}
        error={error.trim().length > 1}
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password}
        onChangeText={text => setPassword(text)}
        error={error.trim().length > 1}
        secureTextEntry
      />

      {error.trim().length > 0 && <Text>{error}</Text>}

      <Button mode="contained" onPress={_handleLogin}>
        Login
      </Button>

      <View>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text>Sign up</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default LoginScreen;
