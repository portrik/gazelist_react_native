import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {DAO, TaskList} from '../model';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native-paper';

export interface ListsScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

const ListsScreen: React.FC<ListsScreenProps> = ({navigation}) => {
  const listDao = new DAO('task_list');
  const user = auth().currentUser;

  const [lists, setLists] = useState<TaskList[]>([]);

  useEffect(() => {
    new DAO('user')
      .getQuery()
      .orderByChild('email')
      .equalTo(user?.email as string)
      .once('value')
      .then(v => {
        const onValueChange = listDao
          .getQuery()
          .orderByChild('users')
          .orderByChild(user?.email as string)
          .equalTo(true)
          .on('value', snapshot => {
            const newLists = (snapshot.val() as Record<string, any>[]).map(t =>
              TaskList.fromJson(t),
            );

            setLists(newLists);
          });

        return () =>
          listDao
            .getQuery()
            .orderByChild('users')
            .orderByChild(user?.email as string)
            .equalTo(true)
            .off('value', onValueChange);
      });
  }, []);

  return (
    <>
      {lists.map(l => (
        <Text>{l.title}</Text>
      ))}
    </>
  );
};

export default ListsScreen;
