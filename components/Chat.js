import React from 'react';
import { StyleSheet, View, Button, Text, Platform, FlatList } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
    constructor(props) {
        super(props);

        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyA5IosLxJ_cfz0um1GMXklR22Jjh9HEKnQ",
                authDomain: "calm-snowfall-231404.firebaseapp.com",
                databaseURL: "https://calm-snowfall-231404.firebaseio.com",
                projectId: "calm-snowfall-231404",
                storageBucket: "calm-snowfall-231404.appspot.com",
                messagingSenderId: "460043889984"
            });
        }

        this.state = {
            messages: [],
            list: [],
            uid: '',
            isConnected: false
        }
    }

    /**
    * Saves messages
    * @async
    * @function saveMessages
    * @param {string} messages
    * @return {AsyncStorage}
    */

    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
    * Deletes messages
    * @async
    * @function deleteMessages
    * @param {string} messages
    * @return {AsyncStorage}
    */

    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
    * Sends messages
    * @async
    * @function onSend
    * @param {string} messages
    * @return {state} GiftedChat
    */

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.saveMessages();
        });
    }

    /**
    * Updates message state using new data
    * @function onCollectionUpdate
    * @param {string} name - list name
    * @param {string} item - item name
    * @returns {state}
    */

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            var data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text.toString(),
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                },
                image: data.image || '',
                location: data.location,
            });
        });
        this.setState({
            messages,
        });
    };

    /**
    * Loads messages from AsyncStorage
    * @async
    * @function getMessages
    * @param {string} messages
    * @return {state} messages
    */

    getMessages = async () => {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
    * If online, renders input toolbar
    * @function renderInputToolbar
    * @param {*} props
    * @returns {InputToolbar}
    */

    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }

    /**
    * formats user icons
    * @function renderBubble
    * @param {*} props
    */

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000'
                    }
                }}
            />
        )
    }

    /**
    * If message has coordinates, displays location on map
    * @function renderCustomView
    * @param {*} props
    * @returns {View}
    * @returns {boolean} false
    */

    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <View
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    componentDidMount() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
                    if (!user) {
                        try {
                            await firebase.auth().signInAnonymously();
                        } catch (error) {
                            console.log(`Cannot sign in: ${error.message}`);
                        }
                    }
                    this.setState({
                        uid: user.uid,
                        loggedInText: 'Hello there',
                        isConnected: true,
                        messages: [
                            {
                                _id: 1,
                                text: 'Hello developer',
                                createdAt: new Date(),
                                user: {
                                    _id: 2,
                                    name: 'React Native',
                                    avatar: 'https://placeimg.com/140/140/any',
                                },
                            },
                            {
                                _id: 2,
                                text: 'Welcome to Let\'s Chat',
                                createdAt: new Date(),
                                system: true,
                            },
                        ]
                    });
                });
            } else {
                this.setState({
                    isConnected: false,
                });
                this.getMessages();
            }
        });
    }

    componentWillUnmount() {
        this.authUnsubscribe();

        this.unsubscribe();
    }

    /**
    * Renders pickImage, takePhoto and getLocation buttons
    * @function renderCustomActions
    * @param {*} props
    * @returns {CustomActions}
    */

    renderCustomActions = (props) => <CustomActions {...props} />;

    render() {
        let name = this.props.route.params.name;

        this.props.navigation.setOptions({ title: name });

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: this.props.route.params.color
                }}
            >
                {/* Rest of the UI */}
                <Text>{this.state.loggedInText}</Text>
                <FlatList
                    data={this.state.lists}
                    renderItem={({ item }) =>
                        <Text>{item.name}: {item.items}</Text>}
                />

                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    renderActions={this.renderCustomActions}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                />

                {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})