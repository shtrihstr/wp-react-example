import React, { Component } from 'react';

export default class Error extends Component {
    render() {
        const { code } = this.props;
        let _code = parseInt(code) || 404;
        let message = "";
        if (_code == 404) {
            message = "Page not found.";
        }
        return (
            <div className="posts">
                <section className="post">
                    <div className="error-message">
                        <h2>{_code}</h2>
                        <h3>{message}</h3>
                    </div>
                </section>
            </div>
        );
    }
}
