import React, {useMemo} from 'react';
import {Text} from 'react-native-paper';

import {Task} from '../model';

export interface TaskSummaryProps {
  tasks: Task[];
}

export const TaskSummary: React.FC<TaskSummaryProps> = ({tasks}) => {
  const tasksToday = useMemo(() => {
    const today = new Date();
    return tasks.filter(
      t =>
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
      t =>
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
      t =>
        t.timeNotification &&
        t.timeNotification.getMilliseconds() > start.getMilliseconds() &&
        t.timeNotification.getMilliseconds() < end.getMilliseconds(),
    ).length;
  }, [tasks]);

  return (
    <>
      <Text>{tasksToday} Tasks Today</Text>

      <Text>{tasksTomorrow} Tasks Tomorrow</Text>

      <Text>{tasksNextWeek} Next Week</Text>
    </>
  );
};
