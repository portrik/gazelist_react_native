import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Account from './screens/Account';
import Calendar from './screens/Calendar';
import Home from './screens/Home';
import Lists from './screens/Lists';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Task from './screens/Task';
import TaskList from './screens/TaskList';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  useEffect(() => {
    auth().onAuthStateChanged(newUser => {
      setUser(newUser);

      if (initializing) {
        setInitializing(false);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Lists" component={Lists} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signin" component={Signup} />
        <Stack.Screen name="Task" component={Task} />
        <Stack.Screen name="TaskList" component={TaskList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
