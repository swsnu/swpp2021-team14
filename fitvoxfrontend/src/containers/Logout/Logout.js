import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';

class Logout extends Component {
    render() {
        return (
            <div className="LogOut">
                <div><h3>Want to Log Out?</h3></div>
                <button id="logout-button" onClick={this.props.onGetLogout}>
                    Logout
                </button>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onGetLogout: () => dispatch(actionCreators.getLogout()),
    };
};

export default connect(null, mapDispatchToProps)(Logout);
