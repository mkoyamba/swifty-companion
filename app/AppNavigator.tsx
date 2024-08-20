import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Homepage from '@/homepage';
import StatPage from '@/statpage';
import { RootStackParamList } from 'components/types';

const Tab = createBottomTabNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#f8f8f8', // Background color of the tab bar
            borderTopColor: '#ddd', // Border color at the top of the tab bar
            borderTopWidth: 1, // Border width at the top of the tab bar
            elevation: 4, // Elevation for shadow effect (Android)
            shadowColor: '#000', // Shadow color (iOS)
            shadowOffset: { width: 0, height: 2 }, // Shadow offset (iOS)
            shadowOpacity: 0.1, // Shadow opacity (iOS)
            shadowRadius: 3, // Shadow radius (iOS)
          }
        }}
        initialRouteName="Homepage"
      >
        <Tab.Screen name="Homepage" component={Homepage} options={{tabBarStyle: {display: "none"}}}/>
        <Tab.Screen name="StatPage" component={StatPage} options={{tabBarStyle: {display: "none"}}}/>
      </Tab.Navigator>
  );
};

export default AppNavigator;