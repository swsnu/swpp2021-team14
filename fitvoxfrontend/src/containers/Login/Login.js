import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import { withRouter } from 'react-router';
import { Paper, Box, Typography, TextField, Button } from '@mui/material';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  onCreatAccount() {
    this.props.history.push('/create_account');
  }

  render() {
    return (
      <Box className="Login" display="flex" justifyContent="center" alignItems="center" gap={2}>
        <span>&lt;</span>
        <Paper>
          <Box component="form" p={6} display="flex" flexDirection="column" gap={4}>
            <Box textAlign="left">
              <Typography variant="h4">FitVox</Typography>
            </Box>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                variant="outlined"
                label="Username"
                value={this.state.username}
                onChange={(event) => this.setState({ username: event.target.value })}
              />
              <TextField
                variant="outlined"
                label="Password"
                type="password"
                value={this.state.password}
                onChange={(event) => this.setState({ password: event.target.value })}
              />
            </Box>
            <Box display="flex" gap={1}>
              <Button
                id="login-button"
                type="submit"
                variant="contained"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.onGetLogin({
                    username: this.state.username,
                    password: this.state.password,
                  });
                }}
              >
                Login
              </Button>
              <Button
                id="create-account-button"
                variant="contained"
                onClick={() => this.onCreatAccount()}
              >
                Create Account
              </Button>
              <Button id="forget-id-password" variant="contained">
                Forget ID or Password?
              </Button>
            </Box>
          </Box>
        </Paper>
        <span>&gt;</span>
      </Box>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onGetLogin: (data) => dispatch(actionCreators.getLogin(data)),
  };
};

export default connect(null, mapDispatchToProps)(withRouter(Login));