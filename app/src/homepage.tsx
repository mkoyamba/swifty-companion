import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { NavigationPropsHomepage, TokenFetchType } from '../components/types'; // Ensure this import path is correct
import { useNavigation } from '@react-navigation/native';

const Homepage: React.FC = () => {

	const [token, setToken] = useState('');
	const [inputValue, setInputValue] = useState('');
	const navigation = useNavigation<NavigationPropsHomepage>();
	const URL = process.env.EXPO_PUBLIC_URL;
	const UUID = process.env.EXPO_PUBLIC_UUID;
	const SECRET = process.env.EXPO_PUBLIC_SECRET;

	console.log(process.env)

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

	const tokenConnect = async (): Promise<number> => {
		if (token === '') {
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

	const handleSubmit = async () => {
		if (token !== '')
			navigation.navigate('StatPage', { inputValue, token });
		else {
			await tokenConnect();
			navigation.navigate('StatPage', { inputValue, token });
		}
	};

	tokenConnect();

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder="Entrez un mot"
				value={inputValue}
				onChangeText={setInputValue}
				onSubmitEditing={handleSubmit} // Lance la fonction quand l'utilisateur appuie sur le bouton de validation du clavier
				returnKeyType="done" // Optionnel: Définit le type de bouton du clavier
			/>
			<Pressable style={styles.button} onPress={handleSubmit}>
				<Text style={styles.buttonText}>{'>'}</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: '10%',
		flexDirection: "row",
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
	},
	input: {
		width: '60%',
		padding: 12,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 40,
		marginRight: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		width: '10%',
		aspectRatio: 1,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 40,
		elevation: 3,
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