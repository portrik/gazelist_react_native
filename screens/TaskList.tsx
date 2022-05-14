import { View, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DAO, Task, TaskList } from '../model';
import { Tasks } from '../components';
import { Title } from 'react-native-paper';
export interface TaskListsProps {
	navigation: NativeStackNavigationProp<any, any>;
	route: RouteProp<{ params: { list: string; title: string } }, 'params'>;
	list: TaskList;
}

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

	tasks: {
		paddingTop: 10,
		flexGrow: 1,
		width: '100%',
		height: '100%',
	},
});

/**
 * Screen displaying the tasks from a selected task list.
 */
const TaskListScreen: React.FC<TaskListsProps> = ({ navigation, route }) => {
	const [tasks, setTasks] = useState<Task[]>([]);

	/**
	 * Loads all tasks associated with task list.
	 */
	useEffect(() => {
		new DAO('task')
			.getQuery()
			.orderByChild(`lists/${route.params.list}`)
			.equalTo(true)
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
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.container}>
				<View style={styles.tasks}>
					<Title>{route.params.title}</Title>

					<Tasks
						tasks={tasks}
						onPress={(t) => navigation.navigate('Task', { task: t.id })}
					/>
				</View>
			</View>
		</View>
	);
};

export default TaskListScreen;
