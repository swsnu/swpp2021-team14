import { Typography, Box, Button } from '@mui/material';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';

class Logout extends Component {
    render() {
        return (
            <Box className="LogOut" display = "flex" justifyContent = "center" alignItems="center" gap = {2}>
                <Button 
                    id="logout-button" 
                    variant = "outlined"
                    onClick={this.props.onGetLogout}>
                    Logout
                </Button>
            </Box>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onGetLogout: () => dispatch(actionCreators.getLogout()),
    };
};

export default connect(null, mapDispatchToProps)(Logout);
