import 'intl';
import auth from '@react-native-firebase/auth';
import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import {
	Button,
	Checkbox,
	Dialog,
	Portal,
	Text,
	TextInput,
	Title,
} from 'react-native-paper';
import {
	DatePickerModal,
	TimePickerModal,
	en,
	registerTranslation,
} from 'react-native-paper-dates';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';

import { DAO, Task, TaskList } from '../model';
import { theme } from '../state/theme';

registerTranslation('en', en);

const styles = StyleSheet.create({
	container: {
		padding: 20,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '100%',
		flex: 1,
	},

	content: {
		width: '100%',
		height: '100%',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-around',
		alignContent: 'space-around',
	},

	timeButtons: {
		height: '10%',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignContent: 'space-around',
	},
});

export interface TaskProps {
	navigation: NativeStackNavigationProp<any, any>;
	route?: RouteProp<{ params: { task: Task } }, 'params'>;
}

/**
 * Screen handling the task lifecycle.
 */
const TaskScreen: React.FC<TaskProps> = ({ navigation, route }) => {
	const user = auth().currentUser;

	const [task, setTask] = useState<Task>(
		new Task('', 'New Task', '', false, {}, {}),
	);
	const [lists, setLists] = useState<TaskList[]>([]);
	const [openDateModal, setOpenDateModal] = useState(false);
	const [openTimeModal, setOpenTimeModal] = useState(false);
	const [openListModal, setOpenListModal] = useState(false);

	/**
	 * Hook loading the task information, if available, and the list of available task lists.
	 */
	useEffect(() => {
		if (route?.params?.task) {
			new DAO(`task/${route.params.task}`)
				.getQuery()
				.once('value')
				.then((value) => setTask(Task.fromJson(value.val())));
		}

		new DAO('user')
			.getQuery()
			.orderByChild('username')
			.equalTo(user?.email as string)
			.once('value')
			.then((value) => {
				const userId = Object.keys(value.val())[0];

				new DAO('task_list')
					.getQuery()
					.orderByChild(`users/${userId}`)
					.equalTo(true)
					.once('value')
					.then((snapshot) => {
						if (!snapshot.val()) {
							return;
						}

						const newLists: TaskList[] = [];
						const rawData = snapshot.val();
						for (const key in rawData) {
							newLists.push(TaskList.fromJson(rawData[key]));
						}

						setLists(newLists);
					});
			});
	}, [route?.params?.task]);

	/**
	 * Handler for the creation or update of a task to Firebase Realtime Database.
	 */
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
				.then((value) => {
					try {
						const userId = Object.keys(value.val())[0];
						const toCreate = JSON.parse(JSON.stringify(task.toJson()));

						toCreate.id = id;
						toCreate.owner = userId;

						dao.create(toCreate);

						if (task.timeNotification) {
							_createNotification(task);
						}

						for (const key in task.lists) {
							new DAO(`list/${key}/users/${userId}`).update({ [userId]: true });
						}

						navigation.goBack();
					} catch (_err) {}
				});

			return;
		}

		await dao.update(task.toJson());
		navigation.goBack();
	};

	/**
	 * Handler for the removal of a task from Firebase Realtime Database.
	 */
	const _handleDelete = () => {
		new DAO('task').remove(task).then(() => navigation.goBack());
	};

	/**
	 * Creates a notification for time based task.
	 */
	const _createNotification = async (task: Task) => {
		const channelId = await notifee.createChannel({
			id: 'default',
			name: 'Default Channel',
		});

		const trigger: TimestampTrigger = {
			type: TriggerType.TIMESTAMP,
			timestamp: task.timeNotification?.getTime() as number,
		};

		await notifee.createTriggerNotification(
			{
				title: task.title,
				body: task.content,
				android: { channelId },
			},
			trigger,
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Title>{route?.params?.task ? 'Update Task' : 'Create New Task'}</Title>

				<TextInput
					label="Title"
					returnKeyType="next"
					value={task.title}
					onChangeText={(text) =>
						setTask(Task.fromJson({ ...task.toJson(), title: text }))
					}
					mode="outlined"
					activeOutlineColor={theme.colors.text}
				/>

				<TextInput
					label="Content"
					returnKeyType="next"
					value={task.content}
					onChangeText={(text) =>
						setTask(Task.fromJson({ ...task.toJson(), content: text }))
					}
					mode="outlined"
					activeOutlineColor={theme.colors.text}
				/>

				<View style={styles.timeButtons}>
					<Button
						onPress={() => setOpenDateModal(true)}
						mode="text"
						color={theme.colors.text}>
						Set Date
					</Button>

					<DatePickerModal
						locale="en"
						mode="single"
						visible={openDateModal}
						date={task.timeNotification ?? new Date()}
						onDismiss={() => setOpenDateModal(false)}
						onConfirm={({ date }) => {
							if (!date) {
								setTask(
									Task.fromJson({ ...task, timeNotification: undefined }),
								);
							} else {
								const current = task.timeNotification;

								setTask(
									Task.fromJson({
										...task,
										timeNotification: new Date(
											date.getFullYear(),
											date.getMonth(),
											date.getDate(),
											current?.getHours() ?? 0,
											current?.getMinutes() ?? 0,
										).getTime(),
									}),
								);
							}

							setOpenDateModal(false);
						}}
						validRange={{ startDate: new Date() }}
					/>

					<Button
						onPress={() => setOpenTimeModal(true)}
						mode="text"
						color={theme.colors.text}>
						Set Time
					</Button>

					<TimePickerModal
						locale="en"
						visible={openTimeModal}
						onDismiss={() => setOpenTimeModal(false)}
						onConfirm={({ hours, minutes }) => {
							if (!!hours && !!minutes) {
								const current = task.timeNotification ?? new Date();

								setTask(
									Task.fromJson({
										...task,
										timeNotification: new Date(
											current.getFullYear(),
											current.getMonth(),
											current.getDate(),
											hours,
											minutes,
										).getTime(),
									}),
								);
							}

							setOpenTimeModal(false);
						}}
						hours={task.timeNotification?.getHours()}
						minutes={task.timeNotification?.getMinutes()}
						label="Select Time"
						animationType="fade"
					/>

					<View>
						<Text>Recurring</Text>

						<Checkbox.Android
							status={task.finished ? 'checked' : 'unchecked'}
							onPress={() =>
								setTask(
									Task.fromJson({ ...task.toJson, finished: !task.finished }),
								)
							}
							color={theme.colors.text}
							uncheckedColor={theme.colors.text}
						/>
					</View>
				</View>

				<Button
					mode="outlined"
					onPress={() => setOpenListModal(true)}
					labelStyle={{ color: theme.colors.text }}>
					Assign To List
				</Button>

				<Portal>
					<Dialog
						visible={openListModal}
						onDismiss={() => setOpenListModal(false)}>
						<Dialog.Title>Select Task Lists</Dialog.Title>

						<Dialog.Content>
							{lists.map((list, index) => (
								<View key={index}>
									<Checkbox.Android
										status={
											task?.lists
												? Object.keys(task.lists).includes(list.id)
													? 'checked'
													: 'unchecked'
												: 'unchecked'
										}
										color={theme.colors.text}
										uncheckedColor={theme.colors.text}
										onPress={() =>
											setTask(
												Task.fromJson({
													...task.toJson(),
													lists: {
														...task.lists,
														[list.id]: !task.lists[list.id],
													},
												}),
											)
										}
									/>

									<Text>{list.title}</Text>
								</View>
							))}
						</Dialog.Content>

						<Dialog.Actions>
							<Button
								onPress={() => setOpenListModal(false)}
								labelStyle={{ color: theme.colors.text }}>
								Done
							</Button>
						</Dialog.Actions>
					</Dialog>
				</Portal>

				<Button mode="contained" onPress={() => navigation.push('Camera')}>
					Add Attachment
				</Button>

				<Button mode="contained" onPress={_handleSubmit}>
					Save
				</Button>

				{route?.params?.task && (
					<Button mode="contained" color="red" onPress={_handleDelete}>
						Delete Task
					</Button>
				)}
			</View>
		</View>
	);
};

export default TaskScreen;
