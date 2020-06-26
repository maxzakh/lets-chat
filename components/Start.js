import React from 'react';
import { StyleSheet, ImageBackground, View, Text, TextInput, TouchableOpacity, Button } from 'react-native';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            color: ''
        }
    }

    render() {
        return (
            <ImageBackground source={require('../assets/BackgroundImage.png')} style={styles.backgroundImage}>
                <Text style={styles.heading}>Welcome to Let's Chat!</Text>
                <View style={styles.container}>
                    <TextInput
                        accessible={true}
                        accessibilityLabel='Input name'
                        onChangeText={(name) => this.setState({ name })}
                        value={this.state.name}
                        placeholder='Your Name'
                        style={styles.input}
                    />
                    <Text style={styles.text}>
                        Select your background color:
                    </Text>
                    <View style={styles.backgroundSelect}>
                        <TouchableOpacity
                            onPress={() => this.setState({ color: '#090C08' })}
                            style={[styles.swatchButton, styles.color1]}
                        />
                        <TouchableOpacity
                            onPress={() => this.setState({ color: '#474056' })}
                            style={[styles.swatchButton, styles.color2]}
                        />
                        <TouchableOpacity
                            onPress={() => this.setState({ color: '#8A95A5' })}
                            style={[styles.swatchButton, styles.color3]}
                        />
                        <TouchableOpacity
                            onPress={() => this.setState({ color: '#B9C6AE' })}
                            style={[styles.swatchButton, styles.color4]}
                        />
                    </View>
                    <Button
                        title="Start Chatting!"
                        onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
                        style={styles.button}
                    />
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    heading: {
        flex: 1,
        alignItems: 'center',
        fontSize: 45,
        fontWeight: "600",
        color: '#FFFFFF',
        marginTop: '75px',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: '44%',
        width: '88%',
        marginBottom: '5%'
    },
    input: {
        fontSize: 16,
        fontWeight: "600",
        backgroundColor: 'white',
        color: '#000000',
        borderWidth: 1,
        borderColor: 'grey',
        margin: '0 30px',
        marginTop: '30px',
        width: '48%'
    },
    text: {
        fontSize: 20,
        fontWeight: "400",
        color: 'white'
    },
    backgroundSelect: {
        flex: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        margin: 15
    },
    swatchButton: {
        height: 35,
        width: 35,
        borderRadius: 70,
        margin: 20
    },
    color1: {
        backgroundColor: '#090C08'
    },
    color2: {
        backgroundColor: '#474056'
    },
    color3: {
        backgroundColor: '#8A95A5'
    },
    color4: {
        backgroundColor: '#B9C6AE'
    },
    button: {
        fontSize: 16,
        fontWeight: "600",
        color: '#FFFFFF',
        backgroundColor: '#757083',
        width: '38%',
        marginBottom: 30
    }
});