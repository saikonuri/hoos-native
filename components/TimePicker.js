import React, { Component } from "react";
import DatePicker from 'react-native-datepicker'
var moment = require('moment');

export default class MyDatePicker extends Component {
    constructor(props) {
        super(props)
        this.state = { date: new Date() }
    }

    render() {
        let date = this.state.date;
        let currDate = new Date();
        let max = new Date();
        max.setFullYear(currDate.getFullYear + 1);
        return (
            <DatePicker
                style={{ width: 200 }}
                date={date}
                mode="datetime"
                format={'MMMM Do YYYY, h:mm:ss a'}
                placeholder={this.props.placeholder}
                minDate={currDate}
                maxDate={max}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                    dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                    },
                    dateInput: {
                        marginLeft: 36
                    }
                    // ... You can check the source to find the other keys. 
                }}
                onDateChange={(date) => { this.setState({ date: date }); this.props.updateDate(date) }}
            />
        )
    }
}