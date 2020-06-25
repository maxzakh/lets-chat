import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Hello Screen1!</Text>
                <TextInput
                    accessible={true}
                    accessibilityLabel='Input name'
                    onChangeText={(name) => this.setState({ name })}
                    value={this.state.name}
                    placeholder='Your Name'
                />
                <Button
                    title="Go to Screen 2"
                    onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name })}
                />
            </View>
        )
    }
}