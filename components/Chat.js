import React from 'react';
import { StyleSheet, View, Button, Text, Platform, FlatList } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
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

        this.referenceShoppingLists = firebase.firestore().collection('shoppinglists');

        this.state = {
            messages: [],
            list: [],
            uid: '',
            isConnected: false
        }
    }

    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
        } catch (error) {
            console.log(error.message);
        }
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.saveMessages();
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

    addList() {
        this.referenceShoppingLists.add({
            name: 'TestList',
            items: ['eggs', 'pasta', 'veggies'],
            uid: this.state.uid,
        });
    }

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

    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
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
                    this.unsubscribe = this.referenceShoppingLists.onSnapshot(this.onCollectionUpdate)
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

                <Button title='Press Me' onPress={() => this.addList()} />

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