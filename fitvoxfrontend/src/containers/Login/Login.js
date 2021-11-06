import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import {withRouter} from "react-router";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };

        this.onGetLogin = this.onGetLogin.bind(this)
    }

    onCreatAccount(){
        this.props.history.push('/create_account')
    }


    render() {
        return (
            <div className="Login" align="center">
                <h1>FitVox</h1>
                <div>
                    <label>Username </label>
                    <input
                        id="username-input"
                        type="text"
                        value={this.state.username}
                        onChange={(event) =>
                            this.setState({ username: event.target.value })
                        }
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        id="pw-input"
                        type="password"
                        value={this.state.password}
                        onChange={(event) =>
                            this.setState({ password: event.target.value })
                        }
                    />
                </div>
                <button id="login-button" onClick={this.onGetLogin({username: this.state.username, password: this.state.password})}>
                    Login
                </button>
                <button id="create-account-button" onClick={()=>this.onCreatAccount()}>Create Account</button>
                <button id="forget-id-password">Forget ID or Password?</button>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onGetLogin: (data) => dispatch(actionCreators.getLogin(data)),
    };
};

export default connect(null, mapDispatchToProps)(withRouter(Login));
