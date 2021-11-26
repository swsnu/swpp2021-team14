import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import { withRouter } from 'react-router';
import {Button} from "@mui/material";
import './WorkoutDetail.css'
import WorkoutEntry from "../WorkoutEntry/WorkoutEntry";

class WorkoutDetail extends Component {

    state = {
        addBodyInfo: false,
        bodyWeight: "",
        bodyFat: "",
        skeletalMuscle: ""
    }

    componentDidMount() {
        this.props.onGetWorkout(this.props.match.params.date);
    }

    onAddWorkout = ()=>{
        this.props.history.push('/workout/'+ this.props.match.params.date + '/add');
    }

    compareEntry = (a, b) =>{
        return a.id-b.id
    }

    onAddBodyInfo = ()=>{
        if(this.state.addBodyInfo){
            this.setState({
                addBodyInfo: false,
                bodyWeight: "",
                bodyFat: "",
                skeletalMuscle: ""
            })
        }
        else{
            this.setState({addBodyInfo: true});
        }
    }

    bodyInfoInput = ()=>{
        return (
            <div>
                <p><label>Body Weight(kg)</label>
                    <input type="number" value={this.state.bodyWeight}
                           onChange={(event) => this.setState({bodyWeight: event.target.value})}/>
                </p>
                <p><label>Skeletal Muscle Mass(kg)</label>
                    <input type="number" value={this.state.skeletalMuscle}
                           onChange={(event) => this.setState({skeletalMuscle: event.target.value})}/></p>
                <p><label>Body Fat Ratio(%)</label>
                    <input type="number" value={this.state.bodyFat}
                           onChange={(event) => this.setState({bodyFat: event.target.value})}/></p>
                <Button onClick>Confirm</Button>

            </div>
        )
    }

    showBodyInfo = ()=>{
        return(
            <div>
                <h4>Body Weight: {this.state.bodyWeight}kg</h4>
                <h4>Skeletal Muscle Mass: {this.state.skeletalMuscle}kg</h4>
                <h4>Body Fat Ratio(%): {this.state.bodyFat}%</h4>
            </div>
        )
    }

    render() {

        let workoutEntries = []
        if(this.props.workoutEntries!=null){
            this.props.workoutEntries.sort(this.compareEntry)

            for(let entry of this.props.workoutEntries){
                workoutEntries.push(<WorkoutEntry id={entry['id']} />)
            }
        }

        const date = this.props.match.params.date;

        const year = date.substring(0, 4);
        const month = date.substring(4, 6);
        const day = date.substring(6, 8);

        return (
            <div className="WorkoutDetail" align="center">
                <div>
                    <h1>Workout of {year+". "+ month+ ". "+ day}</h1>
                    <Button>Start Voice Partner</Button>
                    <Button onClick={()=>this.onAddBodyInfo()}>{this.state.addBodyInfo?"Cancel":"Edit Body Info for the Day"}</Button>
                    {this.state.addBodyInfo?this.bodyInfoInput():this.showBodyInfo()}
                    <Button onClick={()=>this.onAddWorkout()}>Add Exercise to workout</Button>
                    <hr/>
                    {workoutEntries}
                </div>

            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) =>{
    return {
        onGetWorkout: (data)=>dispatch(actionCreators.getWorkout(data))
    }
}

const mapStateToProps = (state)=>{
    return{
        workoutEntries: state.workout.workoutEntries
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkoutDetail));