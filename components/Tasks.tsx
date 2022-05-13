import React from 'react';
import {Text} from 'react-native-paper';

import {Task} from '../model';

export interface TasksProps {
  tasks: Task[];
  onPress: (task: Task) => void;
}

export const Tasks: React.FC<TasksProps> = ({tasks, onPress}) => {
  return (
    <>
      {tasks.length < 1 ? (
        <Text>There are no tasks to display...</Text>
      ) : (
        <>
          {tasks.map((task, index) => (
            <Text key={index} onPress={() => onPress(task)}>
              {task.title}
            </Text>
          ))}
        </>
      )}
    </>
  );
};
