import React, { Component } from 'react';

export default class Iframe extends Component {
    render() {
        let ratio = 9.0 / 16.0;
        if (this.props.width && this.props.height) {
            ratio = 1.0 * this.props.height / this.props.width;
        }

        let src = this.props.src;
        let style = {
            paddingBottom: Math.round(ratio * 100.0) + '%'
        };

        if (false === this.props.visible) {
            return(<div className="frame-loader" style={style}></div>);
        }

        return (
            <div className="frame-loader" style={style}>
                <iframe src={src} frameBorder="0" allowFullScreen="allowfullscreen"></iframe>
            </div>
        );
    }
}

