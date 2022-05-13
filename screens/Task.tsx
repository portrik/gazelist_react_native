import 'intl';
import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { RouteProp } from '@react-navigation/native';
import { Button, TextInput } from 'react-native-paper';
import {
	DatePickerModal,
	en,
	registerTranslation,
} from 'react-native-paper-dates';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DAO, Task } from '../model';

registerTranslation('en', en);

export interface TaskProps {
	navigation: NativeStackNavigationProp<any, any>;
	route?: RouteProp<{ params: { task: Task } }, 'params'>;
}

const TaskScreen: React.FC<TaskProps> = ({ navigation, route }) => {
	const user = auth().currentUser;

	const [taskObject, setTaskObject] = useState<Task>(
		route?.params?.task ?? new Task('', 'New Task', '', false, {}, {}),
	);
	const [openDateModal, setOpenDateModal] = useState(false);

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

		await dao.update({ ...taskObject });
		navigation.goBack();
	};

	return (
		<>
			<TextInput
				label="Title"
				returnKeyType="next"
				value={taskObject.title}
				onChangeText={text => setTaskObject({ ...taskObject, title: text })}
			/>

			<TextInput
				label="Content"
				returnKeyType="next"
				value={taskObject.content}
				onChangeText={text => setTaskObject({ ...taskObject, content: text })}
			/>

			<Button onPress={() => setOpenDateModal(true)} mode="outlined">
				Set Reminder
			</Button>

			<DatePickerModal
				locale="en"
				mode="single"
				visible={openDateModal}
				onDismiss={() => setOpenDateModal(false)}
				date={taskObject.timeNotification}
				onConfirm={({ date }) =>
					setTaskObject({ ...taskObject, timeNotification: date })
				}
				validRange={{ startDate: new Date() }}
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
