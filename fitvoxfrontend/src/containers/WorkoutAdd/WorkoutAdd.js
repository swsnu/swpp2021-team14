import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import { withRouter } from 'react-router';
import {Button} from "@mui/material";
import './WorkoutAdd.css';

class WorkoutAdd extends Component {

}

export default connect(null, null)(withRouter(WorkoutAdd));