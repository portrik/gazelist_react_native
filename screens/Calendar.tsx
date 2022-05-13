import React from 'react';
import { Agenda } from 'react-native-calendars';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface CalendarScreenProps {
	navigation: NativeStackNavigationProp<any, any>;
}

const CalendarScreen: React.FC<CalendarScreenProps> = ({ navigation }) => {
	const today = `${new Date().getFullYear()}-${
		new Date().getMonth() + 1
	}-${new Date().getDate()}`;

	return (
		<>
			<Agenda items={{}} initialDate={today} />
		</>
	);
};

export default CalendarScreen;
