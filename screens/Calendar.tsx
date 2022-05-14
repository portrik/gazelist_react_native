import auth from '@react-native-firebase/auth';
import { View, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Agenda, AgendaEntry, AgendaSchedule } from 'react-native-calendars';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Task, DAO } from '../model';
import { theme } from '../state/theme';
import { Checkbox, List, Text } from 'react-native-paper';

export interface CalendarScreenProps {
	navigation: NativeStackNavigationProp<any, any>;
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		paddingTop: 50,
	},

	dailyTask: {
		height: '100%',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignContent: 'center',
	},

	noItems: {
		padding: 20,
	},
});

/**
 * Screen handling the display of tasks in an agenda view.
 */
const CalendarScreen: React.FC<CalendarScreenProps> = ({ navigation }) => {
	const user = auth().currentUser;
	const [tasks, setTasks] = useState<Task[]>([]);
	const [schedule, setSchedule] = useState<AgendaSchedule>({});

	const dateToString = (date?: Date): string => {
		if (!date) {
			return 'No Date';
		}

		return date.toLocaleDateString('fr-CA', {
			year: 'numeric',
			month: '2-digit',
			day: 'numeric',
		});
	};

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

					new DAO('task')
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

							const newSchedule: AgendaSchedule = {};

							const dates = [
								...new Set(
									newTasks.map((t) => t.timeNotification).map(dateToString),
								),
							];
							for (const date of dates) {
								const dateTasks = newTasks
									.filter((t) => dateToString(t.timeNotification) === date)
									.map((t) => ({ name: t.id, day: date, height: 80 }));

								if (dateTasks.length > 0) {
									newSchedule[date] = dateTasks;
								}
							}

							setSchedule(newSchedule);
						});
				});
		} catch (_err) {}
	}, []);

	/**
	 * Renders the item inside the agenda view.
	 */
	const _renderItem = (entry: AgendaEntry) => {
		/**
		 * Changes the finished state of selected task.
		 */
		const _handleChangeState = (t: Task) => {
			const query = new DAO('task').getQuery();

			query.child(t.id).update({ ...t, finished: !t.finished });
		};

		const task = tasks.find((t) => t.id === entry.name) as Task;

		return (
			<View style={styles.dailyTask}>
				<List.Item
					title={task.title}
					description={task.content}
					onPress={() => navigation.navigate('Task', { task: task.id })}
					right={(props) => (
						<Checkbox.Android
							{...props}
							status={task.finished ? 'checked' : 'unchecked'}
							color={theme.colors.text}
							uncheckedColor={theme.colors.text}
							onPress={() => _handleChangeState(task)}
						/>
					)}
				/>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Agenda
				showClosingKnob
				items={schedule}
				renderItem={_renderItem}
				theme={{
					selectedDayBackgroundColor: theme.colors.primary,
					selectedDayTextColor: theme.colors.text,
					agendaKnobColor: theme.colors.primary,
					dotColor: theme.colors.primary,
				}}
				renderEmptyData={() => (
					<Text style={styles.noItems}>There are no tasks for this day.</Text>
				)}
			/>
		</View>
	);
};

export default CalendarScreen;
