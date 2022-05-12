import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {Button, TextInput} from 'react-native-paper';
import {DAO, Task} from '../model';

export interface TaskProps {
  navigation: NativeStackNavigationProp<any, any>;
  task?: Task;
}

const TaskScreen: React.FC<TaskProps> = ({navigation, task}) => {
  const [taskObject, setTaskObject] = useState<Task>(
    task ?? new Task('', 'New Task', '', {}, {}),
  );

  const _handleSubmit = async () => {
    const dao = new DAO('task');
    const userDao = new DAO('user');

    if (!task) {
      const id = await dao.getNewId();
      const user = auth().currentUser?.email as string;
      await userDao
        .getQuery()
        .orderByChild('email')
        .equalTo(user)
        .once('value')
        .then(v => {
          dao.create({...taskObject, id: id, user: v.key});
        });

      navigation.goBack();
      return;
    }

    await dao.update({...taskObject});
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
