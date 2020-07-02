import React from 'react';
import { StyleSheet, View, Button, Text, Platform, FlatList } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

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
            list: []
        }
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
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
        });
    }

    componentDidMount() {
        this.unsubscribe = this.referenceShoppingLists.onSnapshot(this.onCollectionUpdate)

        this.setState({
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
        })
    }

    componentWillUnmount() {
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
                <FlatList
                    data={this.state.lists}
                    renderItem={({ item }) =>
                        <Text>{item.name}: {item.items}</Text>}
                />

                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
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