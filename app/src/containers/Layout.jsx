import React, { Component } from 'react';
import { connect } from 'react-redux';

import Sidebar from './Sidebar.jsx';

export default class Layout extends Component {

    render() {
        return (
            <div id="layout" className="pure-g">

                <Sidebar />

                <div className="content pure-u-1 pure-u-md-3-4">
                    <div>

                        {this.props.children}

                        <div className="footer">
                            <div className="pure-menu pure-menu-horizontal">
                                <ul>
                                    <li className="pure-menu-item"><a href="http://github.com/shtrihstr/wp-react-example" className="pure-menu-link">View on GitHub</a></li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
/*
function select(state) {
    return {

    };
}

export default connect(select)(Layout);*/