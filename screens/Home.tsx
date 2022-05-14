import { FAB } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import React, { useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Task, DAO } from '../model';
import { Tasks, TaskSummary } from '../components';
import { theme } from '../state/theme';

export interface HomeScreenProps {
	navigation: NativeStackNavigationProp<any, any>;
}

const styles = StyleSheet.create({
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
		backgroundColor: theme.colors.primary,
	},

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
		paddingTop: 40,
		width: '100%',
		height: '100%',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
	},

	tasks: {
		flexGrow: 1,
		paddingTop: 10,
	},
});

/**
 * Home screen displaying the current status and newest tasks.
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
	const taskDao = new DAO('task');
	const user = auth().currentUser;
	const [tasks, setTasks] = useState<Task[]>([]);

	/**
	 * Redirects to the Login page in case of logout.
	 */
	useEffect(() => {
		if (!user) {
			navigation.replace('Login');
		}
	}, [user]);

	/**
	 * Starts listening the the realtime database changes for this user's tasks.
	 */
	useEffect(() => {
		try {
			new DAO('user')
				.getQuery()
				.orderByChild('username')
				.equalTo(user?.email as string)
				.once('value')
				.then((value) => {
					const userId = Object.keys(value.val())[0];

					taskDao
						.getQuery()
						.orderByChild('owner')
						.equalTo(userId)
						.on('value', (snapshot) => {
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
		} catch (_err) {}
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<TaskSummary tasks={tasks} />

				<View style={styles.tasks}>
					<Tasks
						tasks={tasks}
						onPress={(v) => navigation.navigate('Task', { task: v.id })}
					/>

					<FAB
						icon="plus"
						onPress={() => navigation.navigate('Task')}
						style={styles.fab}
						color={theme.colors.text}
					/>
				</View>
			</View>
		</View>
	);
};

export default HomeScreen;
