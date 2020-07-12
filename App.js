import React from 'react';
import { StyleSheet, Alert, Button, Text, TextInput, View, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import Start from './components/Start';
import Chat from './components/Chat';
import CustomActions from './components/CustomActions';

const Stack = createStackNavigator();

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lists: [],
            text: ''
        }
    }

    alertMyText(input = []) {
        Alert.alert(input.text);
    }

    addList() {
        this.referenceShoppingLists.add({
            name: 'TestList',
            items: ['eggs', 'pasta', 'veggies'],
        });
    }

    onCollectionUpdate = (querySnapshot) => {
        const lists = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            var data = doc.data();
            lists.push({
                name: data.name,
                items: data.items.toString(),
            });
        });
        this.setState({
            lists,
        });
    };

    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Start"
                >
                    <Stack.Screen
                        name="Welcome to Let's Chat"
                        component={Start}
                    />
                    <Stack.Screen
                        name="Chat"
                        component={Chat}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
