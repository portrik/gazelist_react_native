import { StyleSheet, View } from 'react-native';
import {
	Button,
	Dialog,
	FAB,
	List,
	Text,
	TextInput,
	Title,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import React, { useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DAO, TaskList } from '../model';
import { theme } from '../state/theme';

export interface ListsScreenProps {
	navigation: NativeStackNavigationProp<any, any>;
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
		paddingTop: 40,
		width: '100%',
		height: '100%',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
	},

	noLists: {
		flex: 1,
		justifyContent: 'center',
		alignContent: 'center',
		alignSelf: 'center',
		width: '100%',
		height: '100%',
	},

	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
		backgroundColor: theme.colors.primary,
	},

	list: {
		flexGrow: 1,
	},
});

/**
 * List screen displaying the available lists.
 */
const ListsScreen: React.FC<ListsScreenProps> = ({ navigation }) => {
	const listDao = new DAO('task_list');
	const user = auth().currentUser;

	const [lists, setLists] = useState<TaskList[]>([]);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [newName, setNewName] = useState('');

	/**
	 * Creates a listener for any new lists where the user is collaborator.
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

					listDao
						.getQuery()
						.orderByChild(`users/${userId}`)
						.equalTo(true)
						.on('value', (snapshot) => {
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
		} catch (_err) {}
	}, []);

	/**
	 * Handles creation of a new task list.
	 */
	const _handleCreate = () => {
		new DAO('user')
			.getQuery()
			.orderByChild('username')
			.equalTo(user?.email as string)
			.once('value')
			.then(async (value) => {
				const userId = Object.keys(value.val())[0];
				const id = await listDao.getNewId();

				listDao.create(
					new TaskList(
						id,
						newName.trim(),
						userId,
						{},
						{ [userId]: true },
					).toJson(),
				);

				setDialogOpen(false);
			});
	};

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Title>Lists</Title>

				{lists.length < 1 ? (
					<View style={styles.noLists}>
						<Text>There are no task lists...</Text>
					</View>
				) : (
					<View style={styles.list}>
						{lists.map((l, i) => (
							<List.Item
								key={i}
								title={l.title}
								onPress={() =>
									navigation.navigate('List', { list: l.id, title: l.title })
								}
							/>
						))}
					</View>
				)}

				<FAB
					icon="plus"
					onPress={() => setDialogOpen(true)}
					style={styles.fab}
					color={theme.colors.text}
				/>

				<Dialog visible={dialogOpen} onDismiss={() => setDialogOpen(false)}>
					<Dialog.Title>Create New Task List</Dialog.Title>

					<Dialog.Content>
						<TextInput
							label="List Name"
							returnKeyType="done"
							value={newName}
							onChangeText={(text) => setNewName(text)}
							mode="outlined"
							activeOutlineColor={theme.colors.text}
						/>
					</Dialog.Content>

					<Dialog.Actions>
						<Button
							onPress={_handleCreate}
							mode="text"
							color={theme.colors.text}>
							Create
						</Button>
					</Dialog.Actions>
				</Dialog>
			</View>
		</View>
	);
};

export default ListsScreen;
