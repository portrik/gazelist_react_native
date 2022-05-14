import { StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import React, { useMemo } from 'react';
import { Card, FAB, Paragraph, Title } from 'react-native-paper';

import { theme } from '../state/theme';

import { Task } from '../model';

export interface TaskSummaryProps {
	tasks: Task[];
}

const styles = StyleSheet.create({
	fab: {
		position: 'absolute',
		top: 5,
		right: 5,
		backgroundColor: theme.colors.text,
	},
});

/**
 * Card displaying the status on the main homepage.
 */
export const TaskSummary: React.FC<TaskSummaryProps> = ({ tasks }) => {
	const tasksToday = useMemo(() => {
		const today = new Date();
		return tasks.filter(
			(t) =>
				t.timeNotification &&
				t.timeNotification.getDate() === today.getDate() &&
				t.timeNotification.getMonth() === today.getMonth() &&
				t.timeNotification.getFullYear() === today.getFullYear(),
		).length;
	}, [tasks]);

	const tasksTomorrow = useMemo(() => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		return tasks.filter(
			(t) =>
				t.timeNotification &&
				t.timeNotification.getDate() === tomorrow.getDate() &&
				t.timeNotification.getMonth() === tomorrow.getMonth() &&
				t.timeNotification.getFullYear() === tomorrow.getFullYear(),
		).length;
	}, [tasks]);

	const tasksNextWeek = useMemo(() => {
		const start = new Date();
		start.setDate(start.getDate() + 7);

		const end = new Date();
		end.setDate(end.getDate() + 14);

		return tasks.filter(
			(t) =>
				t.timeNotification &&
				t.timeNotification.getTime() > start.getTime() &&
				t.timeNotification.getTime() < end.getTime(),
		).length;
	}, [tasks]);

	return (
		<Card style={{ backgroundColor: theme.colors.primary }}>
			<Card.Content>
				<FAB
					icon="account"
					style={styles.fab}
					onPress={() => auth().signOut()}
				/>

				<Title>{tasksToday} Tasks Today</Title>

				<Paragraph>{tasksTomorrow} Tasks Tomorrow</Paragraph>

				<Paragraph>{tasksNextWeek} Next Week</Paragraph>
			</Card.Content>
		</Card>
	);
};
