import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, FlatList, TouchableOpacity, Image, StatusBar } from 'react-native';
import { NavigationPropsHomepage, ProjectsResults, SearchUserType, skillType, StatsResults } from '../components/types';
import { useNavigation } from '@react-navigation/native';

const Homepage: React.FC = () => {

	const [token, setToken] = useState('');
	const [inputValue, setInputValue] = useState('')
	const [filterBankList, setFilterBankList] = useState<SearchUserType[]>([]);
	const navigation = useNavigation<NavigationPropsHomepage>();
	const URL = process.env.EXPO_PUBLIC_URL;
	const UUID = process.env.EXPO_PUBLIC_UUID;
	const SECRET = process.env.EXPO_PUBLIC_SECRET;
	const [stats, setStats] = useState<StatsResults>({
		kind: undefined,
		login: undefined,
		email: undefined,
		level: undefined,
		name: undefined,
		skills: {},
		imageURL: undefined,
		cursus_id: undefined
	});
	const [projects, setProjects] = useState<ProjectsResults[]>([])

	const handleToken = async (): Promise<string> => {
		console.log("Call API 42 token")
		const fetched = await fetch(URL + 'oauth/token', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				grant_type: 'client_credentials',
				client_id: UUID,
				client_secret: SECRET
			})
		}).then(async response => {
			if (response.ok)
				return await response.json();
			return await response.json().then(response => {throw new Error(response.error)})
		}).catch(error => {throw new Error(error.message);})
		const fetchedJSON = await fetched;
		const tokenValue: string = fetchedJSON?.access_token
		if (tokenValue) {
			return tokenValue
		}
		else
			throw new Error(fetchedJSON?.error)
	}

	const tokenConnect = async (renew: boolean): Promise<number> => {
		if (token === '' || renew) {
			let tokenTry = await handleToken().catch((err: Error) => {
				console.log(err)
				Alert.alert("Problème de connexion avec l'API 42: " + err.message)
				console.log("HERE_IS\n\n" + JSON.stringify(process.env))
			})
			if (tokenTry)
				setToken(tokenTry)
		}
		return 0
	}

	const getStats = async (params: string) => {
		if (!params || stats.login === params)
			return {st: stats, pr: projects}
		let statsTemp: StatsResults = {
			kind: undefined,
			login: undefined,
			email: undefined,
			level: undefined,
			name: undefined,
			skills: {},
			imageURL: undefined,
			cursus_id: undefined
		};
		let projectsTemp: ProjectsResults[] = [];
		let request: string;
		request = `${URL}v2/users/${params.toLowerCase()}?access_token=${token}`
		console.log("Call API 42 User")
		const fetched = await fetch(request, {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'GET'
		}).catch((err) => {
			Alert.alert(JSON.stringify(err));
			throw JSON.stringify(err)
		})
		const fetchedJSON = await fetched.json()
		if (fetched.status !== 200) {
			if (fetched.status === 404)
				(Alert.alert('Not found'))
			else if ((await fetched.json())?.error === "The access token is invalid") {
				await tokenConnect(true)
				return await getStats(params)
			}
			else
				Alert.alert(JSON.stringify(fetched.status));
			throw JSON.stringify(fetched.status)
		}
		statsTemp.kind = fetchedJSON?.kind;
		if (fetchedJSON["staff?"])
			statsTemp.kind = 'staff';
		statsTemp.login = fetchedJSON?.login;
		statsTemp.email = fetchedJSON?.email;
		fetchedJSON?.cursus_users.forEach((cursus: any) => {
			if (cursus?.cursus.name === '42cursus') {
				statsTemp.cursus_id = cursus.cursus.id;
				statsTemp.level = cursus.level;
			
				cursus.skills.forEach((skill: skillType) => {
					const name = skill.name;
					const value = skill.level;
					const percent = value / 20 * 100;
					statsTemp.skills[name] = [value, percent]
				})
			}
		})
		fetchedJSON?.projects_users.forEach((project: any) => {
			if (project?.cursus_ids[0] === statsTemp.cursus_id
				&& (project["validated?"] === true || project["validated?"] === false)) {
				let projTemp: ProjectsResults = {
					validated: project["validated?"],
					project_name: project.project.name,
					mark: project.final_mark
				}
				projectsTemp.push(projTemp);
			}
		})
		statsTemp.name = fetchedJSON?.usual_full_name;
		statsTemp.imageURL = fetchedJSON?.image.link;
		setStats(statsTemp);
		setProjects(projectsTemp);
		const result = {
			st: statsTemp,
			pr: projectsTemp
		}
		return result
	}

	const handleSubmit = async (value: string) => {
		let res: {
			st: StatsResults;
			pr: ProjectsResults[];
		} | undefined;
		try {
			res = await getStats(value);
		}
		catch {return}
		if (!res)
			return
		if (token === '') {
			await tokenConnect(false);
			handleSubmit(value);
		}
		else
			navigation.navigate('StatPage', { stats: res.st, projects: res.pr });
	};

	const buttonSub = () => {
		handleSubmit(inputValue)
	}

	const onBankSelected = async (value: string) => {
		setFilterBankList([]);
		handleSubmit(value);
	};

	const handleSearch = async (value: string) => {
		setInputValue(value)
		const searched = await fetch(URL + 'v2/users' + `?access_token=${token}&search[login]=${value}&page[size]=5`, {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'GET',
		}).then(async (res) => {
			if (res.ok)
				return await res.json();
			return await res.json().then(res => {throw res})
		}).catch((err) => {})
		const fetched = await searched;
		const bankListTemp: SearchUserType[] = [];
		try {
			fetched.forEach((user: any) => {
				const UserTemp: SearchUserType = {
					login: user?.login,
					image_url: user?.image.link
				}
				bankListTemp.push(UserTemp)
			})
			setFilterBankList(bankListTemp);
		}
		catch {}
	}

	tokenConnect(false);

	return (
		<View style={styles.page}>
			<StatusBar translucent={true} backgroundColor={'transparent'} />
			<View style={styles.containerLogo}>
				<Image
					style={styles.logo_school}
					source={{
						uri: "https://logowik.com/content/uploads/images/423918.logowik.com.webp",
					}}
				/>
			</View>
			<View style={styles.header}>
				<TextInput
					style={styles.input}
					placeholder="Entrez un login"
					value={inputValue}
					onChangeText={handleSearch}
					onSubmitEditing={buttonSub} // Lance la fonction quand l'utilisateur appuie sur le bouton de validation du clavier
					returnKeyType="done" // Optionnel: Définit le type de bouton du clavier
				/>
				<Pressable style={styles.button} onPress={buttonSub}>
					<Text style={styles.buttonText}>{'>'}</Text>
				</Pressable>
			</View>
			<FlatList
				data={filterBankList}
				style={styles.list}
				contentContainerStyle={styles.listContent}
				renderItem={({item}) => (
					<TouchableOpacity
						onPress={(text) => onBankSelected(item.login)}>
						<View style={styles.searchItemContainer}>
							<Text>{item.login}</Text>
							<Image
								style={styles.pictureSearchItem}
								source={{
									uri: item.image_url,
								}}
							/>
						</View>
					</TouchableOpacity>
				)}
				keyExtractor={item => item.login}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	page: {
		flex: 1,
		backgroundColor: 'white'
	},
	containerLogo: {
		height: 150,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	logo_school: {
		width: '20%',
		aspectRatio: 1
	},
	header: {
		flexDirection: "row",
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
		height: 70
	},
	list: {
		flex: 1,
		width: '100%'
	},
	listContent: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%'
	},
	searchItemContainer: {
		flexDirection: "row",
		width: '80%',
		justifyContent: 'space-between',
		borderTopWidth: 1,
		borderColor: '#dbdbdb'
	},
	pictureSearchItem: {
		width: 70,
		aspectRatio: 1,
		borderRadius: 150,
		margin: '2%',
	},
	input: {
		width: '60%',
		height: 50,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 40,
		marginRight: 16,
		paddingLeft: '5%'
	},
	button: {
		width: 50,
		aspectRatio: 1,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 40,
		backgroundColor: '#000000',
	},
	buttonText: {
		color: '#ffffff',
		lineHeight: 21,
		fontWeight: 'bold',
		fontSize: 20,
	}
});

export default Homepage;