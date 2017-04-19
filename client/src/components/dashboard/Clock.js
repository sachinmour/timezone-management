import React, { Component } from 'react';
import moment from 'moment-timezone';

class Clock extends Component {
    constructor(props) {
        super(props);
        this.state = { date: moment.tz(new Date(), props.timezone) };
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        const { timezone } = this.props;
        this.setState({
            date: moment.tz(new Date(), timezone)
        });
    }

    render() {
        const { date } = this.state;
        return <span>{date.format('lll')}</span>;
    }
}

export default Clock;
