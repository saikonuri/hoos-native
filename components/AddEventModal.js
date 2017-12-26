import { TouchableOpacity, TouchableWithoutFeedback, Modal } from 'react-native'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import React, { Component } from "react";
import {
    Container,
    Title,
    Content,
    Footer,
    FooterTab,
    Left,
    Right,
    Body,
    Form,
    Item,
    Input
} from "native-base";
import { StyleSheet, View, AsyncStorage, Text, Picker } from "react-native";
import { Header, Avatar, Button } from "react-native-elements";
import { MapView } from "expo";
import { Font } from "expo";
import TimePicker from './TimePicker.js'
import locations from '../assets/areas.json'
import axios from "axios";
import Icon from 'react-native-vector-icons/FontAwesome';
import { locale } from 'moment';
const url = "https://shrouded-forest-95429.herokuapp.com";
const url2 = "http://192.168.1.160:4000"

export default class AddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontLoaded: false,
            selectedLocation: 'Aquatics and Fitness Center',
            name: '',
            description: '',
            startDate: null,
            endDate: null
        }
    }

    async componentWillMount() {
        await Font.loadAsync({
            bungee: require("../assets/fonts/Bungee-Regular.ttf")
        });
        this.setState({
            fontLoaded: true
        });
    }

    createEvent() {
        let body = {
            name: this.state.name,
            description: this.state.description,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            location: this.state.selectedLocation,
            creator: this.props.user.email
        }
        axios({
            method: 'post',
            url: url2 + '/api/events',
            data: body
        })
            .then((res) => console.log(res))
            .catch((error) => {
                console.log(error);
            });
        this.props.closeModal();
    }

    render() {
        let count = 0;
        let pickerItems = locations.map(location => {
            return (
                <Picker.Item label={location.name} value={location.name} id={count--} />
            );
        })

        return (
            <Modal
                visible={this.props.visible}
                animationType='slide'
                transparent={true}
            >
                <View style={styles.modal}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.closeModal();
                        }}
                        style={styles.close}
                    >
                        <Icon name="arrow-left" size={20} />
                    </TouchableOpacity>
                    <View style={styles.form}>
                        <Form>
                            {this.state.fontLoaded ? (
                                <Title style={{ fontFamily: 'bungee' }}>Add Event</Title>
                            ) : (
                                    <Title>"Add Event"</Title>
                                )}
                            <Item>
                                <Input placeholder="Name of Event" onChangeText={(text) => this.setState({ name: text })} />
                            </Item>
                            <Item>
                                <Input placeholder="Description" onChangeText={(text) => this.setState({ description: text })} />
                            </Item>
                        </Form>
                        <TimePicker placeholder='Select Start Date/Time' updateDate={(date) => this.setState({ startDate: date })} />
                        <TimePicker placeholder='Select End Date/Time' updateDate={(date) => this.setState({ endDate: date })} />
                        <Picker
                            selectedValue={this.state.selectedLocation}
                            onValueChange={(itemValue, itemIndex) => this.setState({ selectedLocation: itemValue })}>
                            {pickerItems}
                        </Picker>
                        <View style={{ width: 150, marginLeft: 75 }}>
                            <Button
                                small
                                borderRadius={30}
                                title="Confirm"
                                backgroundColor="black"
                                onPress={() => this.createEvent()}
                            />
                        </View>
                        <View style={{ width: 150, marginLeft: 75 }}>
                            <Button
                                small
                                borderRadius={30}
                                title="Cancel"
                                backgroundColor="black"
                                onPress={() => this.props.closeModal()}
                            />
                        </View>
                    </View>
                </View>

            </Modal >
        );
    }
}

const styles = {
    modal: {
        marginTop: 100,
        backgroundColor: 'white',
        borderRadius: 30,
        height: 600,
        marginLeft: 20,
        marginRight: 20,
    },
    close: {
        marginTop: 8,
        marginLeft: 8,
        width: 20
    },
    form: {
        width: 300,
        marginLeft: '6%',
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    date: {

    }
}