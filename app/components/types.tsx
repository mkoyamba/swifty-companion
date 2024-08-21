import { NavigationProp, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
	Homepage: undefined,
	StatPage: {
	  inputValue: string;
	  token: string;
	}
};

export type NavigationPropsHomepage = NativeStackNavigationProp<RootStackParamList, 'Homepage'>;

export type NavigationPropsStatpage = NativeStackScreenProps<RootStackParamList, 'StatPage'>;

export type NavigationPropsStatpageNavigation = NativeStackNavigationProp<RootStackParamList, 'StatPage'>;

export type StatsResults = {
	kind: string | undefined,
	login: string | undefined,
	email: string | undefined,
	level: string | undefined,
	name: string | undefined,
	skills: {
		[key: string]: [number, number];
	},
	imageURL: string | undefined,
	cursus_id: number | undefined
}

export type ProjectsResults = {
	validated: true | false | null | undefined,
	project_name: string | undefined,
	mark: number | null | undefined,
}

export type skillType = {
	id: number,
	name: string,
	level: number
}

export type TokenFetchType = {
	"access_token": string,
	[key: string]: any;
}