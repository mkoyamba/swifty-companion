import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { NavigationPropsStatpage, skillType, StatsResults } from '../components/types'; // Ensure this import path is correct
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { URL } from '@env'

const StatPage : React.FC<NavigationPropsStatpage> = ( root ) => {
	const { inputValue, token } = root.route.params;
	const navigation = useNavigation<NavigationPropsStatpage>();

	const [stats, setStats] = useState<StatsResults>({
		kind: undefined,
		login: undefined,
		email: undefined,
		level: undefined,
		name: undefined,
		skills: {},
		imageURL: undefined,
	});

	const getStats = async () => {
		if (stats.login === inputValue)
			return
		let statsTemp: StatsResults = {
			kind: undefined,
			login: undefined,
			email: undefined,
			level: undefined,
			name: undefined,
			skills: {},
			imageURL: undefined,
		};
		console.log("Call API 42 User")
		const fetched = await fetch(`${URL}v2/users/${inputValue}?access_token=${token}`, {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'GET'
		}).catch((err) => {
			console.log(err)
			throw JSON.stringify(err);
		})
		const fetchedJSON = await fetched.json()
		if (!fetched.ok)
			throw JSON.stringify(await fetchedJSON)
		const id: string = fetchedJSON?.id
		if (!id) {
			Alert.alert('Not found');
			console.log('ouch')
			navigation.navigation.goBack();
			return
		}
		statsTemp.kind = fetchedJSON?.kind;
		statsTemp.login = fetchedJSON?.login;
		statsTemp.email = fetchedJSON?.email;
		fetchedJSON?.cursus_users.forEach((cursus: any) => {
			if (cursus?.cursus.name === '42cursus')
				statsTemp.level = cursus.level;
			cursus.skills.forEach((skill: skillType) => {
				const name = skill.name;
				const value = skill.level;
				const percent = value / 20 * 100;
				statsTemp.skills[name] = [value, percent]
			})
		})
		statsTemp.name = fetchedJSON?.usual_full_name;
		statsTemp.imageURL = fetchedJSON?.image.link;
		setStats(statsTemp);
	}
	


	useFocusEffect(() => {getStats().catch(err => {
		console.log(err)
		});
	})
	
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.kind}>{stats.kind}</Text>
				<Text style={styles.login}>{stats.login}</Text>
				<Image
					style={styles.picture}
					source={{
						uri: stats.imageURL,
					}}
				/>
				<Text style={styles.name}>{stats.name}</Text>
				<Text style={styles.stat}>Level: {stats.level}</Text>
				<Text style={styles.stat}>Email: {stats.email}</Text>
				<Text style={styles.skillHeader}>Skills:</Text>
			</View>
			<ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
				{Object.entries(stats.skills).map(([skillName, [level, percent]]) => (
					<View key={skillName} style={styles.skillContainer}>
						<Text style={styles.skillName}>{skillName}</Text>
						<View style={styles.skillDetailsContainer}>
							<Text style={styles.skillLevel}>{level.toFixed(2)}</Text>
							<Text style={styles.skillPercent}>{percent.toFixed(2)}%</Text>
						</View>
					</View>
				))}
			</ScrollView>
			<View style={styles.projectsContainer}>
			</View>
		</View>
	);
  };

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#faf2d7'
	},
	header: {
		height: '40%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	scrollContainer: {
		flex: 1,
		width: '100%'
	},
	scrollContent: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 20
	},
	kind: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 15
	},
	login: {
		color: 'black',
		fontWeight: 'medium',
		fontSize: 25
	},
	name: {
		color: 'black',
		fontWeight: 'medium',
		fontSize: 15
	},
	stat: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 15
	},
	picture: {
		height: '40%',
		aspectRatio: 1,
		borderRadius: 150,
		margin: '2%'
	},
	skillHeader: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'black',
		marginTop: 10
	},
	skillContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '90%',
		marginBottom: 15
	},
	skillName: {
		fontSize: 16,
		fontWeight: 'bold',
		color: 'black',
		flex: 1
	},
	skillDetailsContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	skillLevel: {
		fontSize: 14,
		color: 'black',
		marginLeft: 10,
	},
	skillPercent: {
		fontSize: 14,
		color: 'black',
		fontWeight: 'bold',
		marginLeft: 10
	},
	projectsContainer: {
		flex: 1,
		marginTop: 10
	},
});

export default StatPage;