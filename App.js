import React from 'react';
import { StyleSheet, Alert, Button, Text, TextInput, View, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Start from './components/Start';
import Chat from './components/Chat';

const Stack = createStackNavigator();

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: '' }
    }

    alertMyText(input = []) {
        Alert.alert(input.text);
    }

    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Start"
                >
                    <Stack.Screen
                        name="Welcome"
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    box1: {
        flex: 10,
        backgroundColor: 'blue'
    },
    box2: {
        flex: 120,
        backgroundColor: 'red'
    },
    box3: {
        flex: 50,
        backgroundColor: 'green'
    }
});
