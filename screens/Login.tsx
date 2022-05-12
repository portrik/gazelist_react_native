import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Text, TouchableOpacity, View} from 'react-native';
import {TextInput, Button} from 'react-native-paper';

const LoginScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, any>;
}> = ({navigation}) => {
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});

  const _handleLogin = async () => {
    try {
      if (email.error) {
        throw new Error(email.error);
      }

      if (password.error) {
        throw new Error(password.error);
      }

      await auth().signInWithEmailAndPassword(
        email.value.trim(),
        password.value,
      );

      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Text>Login</Text>

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({value: text, error: ''})}
        error={!!email.error}
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({value: text, error: ''})}
        error={!!password.error}
        secureTextEntry
      />

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
