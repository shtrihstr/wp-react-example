import React, { Component } from 'react';

export default class Image extends Component {

    render() {
        //todo: show placeholder during loading
        return (<img {...this.props} />);
    }
}
