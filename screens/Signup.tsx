import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Text, TouchableOpacity, View} from 'react-native';
import {TextInput, Button} from 'react-native-paper';

import {DAO, User} from '../model';

const SignupScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, any>;
}> = ({navigation}) => {
  const [username, setUsername] = useState({value: '', error: ''});
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});

  const _handleSignIn = async () => {
    try {
      if (username.error) {
        throw new Error(username.error);
      }

      if (email.error) {
        throw new Error(email.error);
      }

      if (password.error) {
        throw new Error(password.error);
      }

      const response = await auth().createUserWithEmailAndPassword(
        email.value.trim(),
        password.value,
      );

      const dao = new DAO('user');
      const id = await dao.getNewId();
      await dao.create(new User(id, response.user.email as string));

      navigation.replace('Home');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Text>Create Account</Text>

      <TextInput
        label="Username"
        returnKeyType="next"
        value={username.value}
        onChangeText={text => setUsername({value: text, error: ''})}
        error={!!username.error}
        autoCapitalize="none"
        autoComplete="username-new"
        textContentType="username"
      />

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

      <Button mode="contained" onPress={_handleSignIn}>
        Create Account
      </Button>

      <View>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text>Sign up</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SignupScreen;
