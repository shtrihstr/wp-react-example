import React, { Component } from 'react';

export default class Iframe extends Component {
    render() {
        // default video ratio
        let ratio = 9.0 / 16.0;

        if (this.props.width && this.props.height) {
            // current video ratio from iframe params
            ratio = 1.0 * this.props.height / this.props.width;
        }

        let src = this.props.src;

        // responsive iframe
        let style = {
            paddingBottom: Math.round(ratio * 100.0) + '%'
        };

        return (
            <div className="frame-loader" style={style}>
                <iframe src={src} frameBorder="0" allowFullScreen="allowfullscreen"></iframe>
            </div>
        );
    }
}

