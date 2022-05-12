import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';

import {Task, DAO} from '../model';
import {Text} from 'react-native-paper';

export interface HomeScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const taskDao = new DAO('task');
  const user = auth().currentUser;
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    new DAO('user')
      .getQuery()
      .orderByChild('email')
      .equalTo(user?.email as string)
      .once('value')
      .then(v => {
        const onValueChange = taskDao
          .getQuery()
          .orderByChild('owner')
          .equalTo(user?.email as string)
          .on('value', snapshot => {
            const newTasks = (snapshot.val() as Record<string, any>[]).map(t =>
              Task.fromJson(t),
            );

            setTasks(newTasks);
          });

        return () =>
          taskDao
            .getQuery()
            .orderByChild('email')
            .equalTo(user?.email as string)
            .off('value', onValueChange);
      });
  }, []);

  return (
    <>
      {tasks.map(t => (
        <Text>{t.title}</Text>
      ))}
    </>
  );
};

export default HomeScreen;
