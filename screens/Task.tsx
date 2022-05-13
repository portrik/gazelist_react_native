import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {Button, TextInput} from 'react-native-paper';
import {DAO, Task} from '../model';
import {RouteProp} from '@react-navigation/native';

export interface TaskProps {
  navigation: NativeStackNavigationProp<any, any>;
  route?: RouteProp<{params: {task: Task}}, 'params'>;
}

const TaskScreen: React.FC<TaskProps> = ({navigation, route}) => {
  const user = auth().currentUser;

  const [taskObject, setTaskObject] = useState<Task>(
    route?.params?.task ?? new Task('', 'New Task', '', {}, {}),
  );

  const _handleSubmit = async () => {
    const dao = new DAO('task');
    const userDao = new DAO('user');

    if (!route?.params?.task) {
      const id = await dao.getNewId();
      await userDao
        .getQuery()
        .orderByChild('username')
        .equalTo(user?.email as string)
        .once('value')
        .then(value => {
          dao.create({
            ...taskObject,
            id: id,
            owner: Object.keys(value.val())[0],
          });
        });

      navigation.goBack();
      return;
    }

    await dao.update({...taskObject});
    navigation.goBack();
  };

  return (
    <>
      <TextInput
        label="Title"
        returnKeyType="next"
        value={taskObject.title}
        onChangeText={text => setTaskObject({...taskObject, title: text})}
      />

      <TextInput
        label="Content"
        returnKeyType="next"
        value={taskObject.content}
        onChangeText={text => setTaskObject({...taskObject, content: text})}
      />

      <Button mode="contained" onPress={_handleSubmit}>
        Save
      </Button>

      <Button mode="contained" onPress={() => navigation.goBack()}>
        Cancel
      </Button>
    </>
  );
};

export default TaskScreen;
