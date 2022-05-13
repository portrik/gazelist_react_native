import {FAB} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Task, DAO} from '../model';
import {Tasks, TaskSummary} from '../components';

export interface HomeScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const taskDao = new DAO('task');
  const user = auth().currentUser;
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    }

    new DAO('user')
      .getQuery()
      .orderByChild('username')
      .equalTo(user?.email as string)
      .once('value')
      .then(value => {
        const userId = Object.keys(value.val())[0];

        taskDao
          .getQuery()
          .orderByChild('owner')
          .equalTo(userId)
          .on('value', snapshot => {
            if (!snapshot.val()) {
              return;
            }

            const newTasks: Task[] = [];
            const rawData = snapshot.val();
            for (const key in rawData) {
              newTasks.push(Task.fromJson(rawData[key]));
            }

            setTasks(newTasks);
          });
      });
  }, []);

  return (
    <>
      <TaskSummary tasks={tasks} />

      <Tasks
        tasks={tasks}
        onPress={v => navigation.navigate('Task', {task: v})}
      />

      <FAB
        small
        icon="plus"
        onPress={() => navigation.navigate('Task')}
        style={styles.fab}
      />
    </>
  );
};

export default HomeScreen;
