import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import { withRouter } from 'react-router';
import {Button} from "@mui/material";
import './WorkoutDetail.css'

class WorkoutDetail extends Component {

    componentDidMount() {
        this.props.onGetWorkout();
    }

    render() {
        return (
            <div className="WorkoutDetail" align="center">
                <div>
                    <h1>Workout Detail</h1>
                    <Button>Add Exercise to workout</Button>
                </div>

            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) =>{
    return {
        onGetWorkout: ()=>dispatch(actionCreators.getWorkout())
    }
}

export default connect(null, mapDispatchToProps)(withRouter(WorkoutDetail));