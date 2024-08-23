import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, ScrollView, Button, Pressable } from 'react-native';
import { NavigationPropsStatpage, NavigationPropsStatpageNavigation, ProjectsResults, skillType, StatsResults } from '../components/types'; // Ensure this import path is correct
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const StatPage : React.FC<NavigationPropsStatpage> = ( root ) => {
	const { stats, projects } = root.route.params;
	const navigation = useNavigation<NavigationPropsStatpageNavigation>();
	
	return (
		<View style={styles.container}>
			<Pressable onPress={() => navigation.goBack()}>
				<View style={styles.goBackButton}>
					<Text style={styles.goBackButtonText}>{'<'}</Text>
				</View>
			</Pressable>
			<View style={styles.header}>
				<Text style={styles.kind}>{stats.kind}</Text>
				<Text style={styles.login}>{stats.login}</Text>
				{stats.imageURL ?
					<Image
						style={styles.picture}
						source={{
							uri: stats.imageURL,
						}}
					/>
					:null
				}
				<Text style={styles.name}>{stats.name}</Text>
				<Text style={styles.stat}>Level: {stats.level}</Text>
				<Text style={styles.stat}>Email: {stats.email}</Text>
			</View>
			<View style={styles.title}><Text style={styles.skillHeader}>Skills:</Text></View>
			<ScrollView style={styles.skillsScrollContainer} contentContainerStyle={styles.skillsScrollContent}>
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
			<View style={styles.title}><Text style={styles.projectsHeader}>Projects:</Text></View>
			<ScrollView style={styles.projectsScrollContainer} contentContainerStyle={styles.projectsScrollContent}>
				{projects?.map((project, index) => (
					<View key={index} style={styles.skillContainer}>
						<Text style={styles.projectName}>{project.project_name}</Text>
						<View style={styles.projectDetailsContainer}>
							<Text style={[
								styles.projectMark, {color: project.validated ? '#51e051' : '#fa0202'}]}
								>{project.mark}
							</Text>
						</View>
					</View>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#faf2d7'
	},
	goBackButton: {
		color: '#cfcccc',
		width: '10%',
		aspectRatio: 1,
		borderRadius: 150,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#cfcccc',
		margin: '2%',
		position: 'absolute',
	},
	goBackButtonText: {
		fontSize: 25,
		lineHeight: 27,
		fontWeight: 'bold',
		color: '#ffffff'
	},
	header: {
		height: '40%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	title: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	skillsScrollContainer: {
		flex: 1,
		width: '100%'
	},
	skillsScrollContent: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 20
	},
	projectsScrollContainer: {
		flex: 1,
		width: '100%'
	},
	projectsScrollContent: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 20
	},
	kind: {
		color: '#000000',
		fontWeight: 'bold',
		fontSize: 15
	},
	login: {
		color: '#000000',
		fontWeight: 'medium',
		fontSize: 25
	},
	name: {
		color: '#000000',
		fontWeight: 'medium',
		fontSize: 15
	},
	stat: {
		color: '#000000',
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
		color: '#000000',
		marginTop: 10
	},
	projectsHeader: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
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
		fontWeight: 'medium',
		color: '#000000',
		flex: 1
	},
	skillDetailsContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	skillLevel: {
		fontSize: 14,
		color: '#000000',
		marginLeft: 10,
	},
	skillPercent: {
		fontSize: 14,
		color: '#000000',
		fontWeight: 'bold',
		marginLeft: 10
	},
	projectsContainer: {
		flex: 1,
		marginTop: 10
	},
	projectName: {
		fontSize: 16,
		fontWeight: 'medium',
		color: '#000000',
		flex: 1
	},
	projectDetailsContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	projectMark: {
		fontSize: 14,
		marginLeft: 10,
		fontWeight: 'bold'
	},
});

export default StatPage;