import { View } from 'react-native';
import React, { useMemo } from 'react';
import { Checkbox, List, Text } from 'react-native-paper';

import { DAO, Task } from '../model';
import { theme } from '../state/theme';

export interface TasksProps {
	tasks: Task[];
	onPress: (task: Task) => void;
}

/**
 * Component used for a simple display of tasks based on their due dates.
 */
export const Tasks: React.FC<TasksProps> = ({ tasks, onPress }) => {
	/**
	 * Parses date into a human readable string.
	 *
	 * @param date Date to be converted
	 *
	 * @returns Human readable date string
	 */
	const dateToString = (date: Date) => {
		const today = new Date();

		if (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		) {
			return 'Today';
		}

		today.setDate(today.getDate() + 1); // Handles switch to a new month automatically

		if (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		) {
			return 'Tomorrow';
		}

		return `${date.getDate()}.${date.getMonth() + 1}`;
	};

	/**
	 * Sorts tasks along their due dates.
	 */
	const sortedTasks = useMemo(() => {
		const rawDates = [
			...new Set(
				tasks.map((t) =>
					t.timeNotification ? dateToString(t.timeNotification) : '',
				),
			),
		];
		const dates: { [key: string]: Task[] } = {};

		for (const date of rawDates) {
			if (date.trim().length < 1) {
				dates['No Date'] = tasks.filter(
					(task) => !task.timeNotification && !task.finished,
				);
				continue;
			}

			dates[date] = tasks.filter(
				(t) =>
					t.timeNotification &&
					dateToString(t.timeNotification) === date &&
					!t.finished,
			);
		}

		dates['Finished'] = tasks.filter((t) => t.finished);

		return dates;
	}, [tasks]);

	/**
	 * Changes the finished state of selected task.
	 */
	const _handleChangeState = (task: Task) => {
		const query = new DAO('task').getQuery();

		query.child(task.id).update({ ...task, finished: !task.finished });
	};

	return (
		<View>
			{tasks.length < 1 ? (
				<Text>There are no tasks to display...</Text>
			) : (
				<>
					{Object.keys(sortedTasks).map((key, index) => (
						<View key={index}>
							{sortedTasks[key].length > 0 && (
								<List.Section key={index}>
									<List.Subheader>{key}</List.Subheader>

									<>
										{sortedTasks[key].map((t, i) => (
											<List.Item
												key={i}
												title={t.title}
												description={t.content}
												onPress={() => onPress(t)}
												left={(props) => (
													<Checkbox.Android
														{...props}
														status={t.finished ? 'checked' : 'unchecked'}
														onPress={() => _handleChangeState(t)}
														color={theme.colors.text}
														uncheckedColor={theme.colors.text}
													/>
												)}
											/>
										))}
									</>
								</List.Section>
							)}
						</View>
					))}
				</>
			)}
		</View>
	);
};
