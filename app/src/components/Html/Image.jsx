import React, { Component } from 'react';

export default class Image extends Component {

    render() {
        //todo: lazy-load
        return (<img {...this.props} />);
    }
}
