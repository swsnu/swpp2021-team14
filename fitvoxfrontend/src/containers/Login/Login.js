import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };

        this.validate = this.validate.bind(this)
    }

    validate() {

        let isValid = this.state.email === 'swpp@snu.ac.kr' && this.state.password === 'iluvswpp';

        if (isValid) {
            this.props.onGetLogin();
        } else alert('Email or password is wrong');
    }

    render() {
        return (
            <div className="Login" align="center">
                <h1>SWPP HW3</h1>
                <div>
                    <label>Email-Input: </label>
                    <input
                        id="email-input"
                        type="text"
                        value={this.state.email}
                        onChange={(event) =>
                            this.setState({ email: event.target.value })
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
                <button id="login-button" onClick={this.validate}>
                    Login
                </button>
                <button id="create-account-button">Create Account</button>
                <button id="forget-id-password">Forget ID or Password?</button>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onGetLogin: () => dispatch(actionCreators.getLogin()),
    };
};

export default connect(null, mapDispatchToProps)(Login);
