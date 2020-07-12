import React from 'react';
import PropTypes from 'prop-types';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const firebase = require('firebase');

export default class CustomActions extends React.Component {
    constructor() {
        super();
    }

    pickImage = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status === 'granted') {
            try {
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: 'Images',
                });
            } catch (error) {
                console.log(`Cannot pick image: ${error.message}`);
            }

            if (!result.cancelled) {
                this.setState({
                    image: result
                });
            }

        }
    }

    takePhoto = async () => {
        try {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
            if (status === 'granted') {
                try {
                    let result = await ImagePicker.launchCameraAsync({
                        mediaTypes: 'Images',
                    });
                } catch (error) {
                    console.log(`insufficient access: ${error.message}`);
                }

                if (!result.cancelled) {
                    this.setState({
                        image: result
                    });
                }
            }
        } catch (error) {
            console.log(`Cannot take photo: ${error.message}`);
        }
    }

    getLocation = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
            let result = await Location.getCurrentPositionAsync({});

            if (status === 'granted') {
                try {
                    const result = await Location.getCurrentPositionAsync({});
                    if (result) {
                        this.setState({
                            location: result
                        });
                    }
                } catch (error) {
                    console.log(`Cannot send location: ${error.message}`);
                }
            }
        }
    }

    uploadImage = async (uri) => {
        try {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    console.log(e);
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });

            const ref = firebase.storage().ref().child('my-image');
            const snapshot = await ref.put(blob);

            blob.close();

            const imageURL = await snapshot.ref.getDownloadURL();
            return imageURL;
        } catch (error) {
            console.log(`Cannot upload image: ${error.message}`);
        }
    }

    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log('user wants to pick an image');
                        return;
                    case 1:
                        console.log('user wants to take a photo');
                        return;
                    case 2:
                        console.log('user wants to get their location');
                    default:
                }
            },
        );
    };

    render() {
        return (
            <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};