import React, { useMemo } from 'react';
import { Checkbox, List, Text } from 'react-native-paper';

import { DAO, Task } from '../model';

export interface TasksProps {
	tasks: Task[];
	onPress: (task: Task) => void;
}

export const Tasks: React.FC<TasksProps> = ({ tasks, onPress }) => {
	const sortedTasks = useMemo(() => {
		const todayDate = new Date();
		const today = `${todayDate.getDate()}.${todayDate.getMonth() + 1}.`;

		const rawDates = [...new Set(tasks.map(t => t.timeNotification))];
		const dates: { [key: string]: Task[] } = {};

		for (const date of rawDates) {
			if (date) {
				let key = `${date.getDate()}.${date.getMonth() + 1}`;

				if (key === today) {
					key = 'Today';
				}

				dates[key] = tasks.filter(t => t.timeNotification);
			}
		}

		return dates;
	}, [tasks]);

	const _handleChangeState = (task: Task) => {
		const query = new DAO('task').getQuery();

		query.child(task.id).update({ ...task, finished: !task.finished });
	};

	return (
		<>
			{tasks.length < 1 ? (
				<Text>There are no tasks to display...</Text>
			) : (
				<>
					{tasks.map((t, index) => (
						<List.Item
							key={index}
							title={t.title}
							description={t.content}
							onPress={() => onPress(t)}
							left={props => (
								<Checkbox
									{...props}
									status={t.finished ? 'checked' : 'unchecked'}
									onPress={() => _handleChangeState(t)}
								/>
							)}
						/>
					))}
				</>
			)}
		</>
	);
};
