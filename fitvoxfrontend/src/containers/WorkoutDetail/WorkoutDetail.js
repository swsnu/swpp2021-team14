import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import { withRouter } from 'react-router';
import {Button, Box, IconButton} from "@mui/material";
import './WorkoutDetail.css'
import WorkoutEntry from "../WorkoutEntry/WorkoutEntry";
import Menu from '../Menu/Menu';
import AudioPlayer from "react-h5-audio-player"
import 'react-h5-audio-player/lib/styles.css'
import * as actionTypes from '../../store/actions/actionTypes'

import ArrowBackIcon from '@mui/icons-material/ArrowBack';


class WorkoutDetail extends Component {

    constructor(props) {
        super(props);

        const dayBodyInfo = this.props.bodyInfo.find(element=>element.date === parseInt(this.props.match.params.date))

        let bodyWeight, bodyFat, skeletalMuscle;

        if(dayBodyInfo==undefined){
            bodyWeight="Not Given Yet";
            bodyFat = "Not Given Yet";
            skeletalMuscle = "Not Given Yet";
        }
        else{
            bodyWeight = dayBodyInfo.bodyWeight;
            bodyFat = dayBodyInfo.bodyFat;
            skeletalMuscle = dayBodyInfo.skeletalMuscle;
        }

        this.state = {
            addBodyInfo: false,
            bodyWeight,
            bodyFat,
            skeletalMuscle,
            currWav: -1
        };
    }

    componentDidMount() {
        this.props.onGetWorkout(this.props.match.params.date);
        this.props.onGetBodyInfo();
        this.props.onEndVoicePartner()
    }

    onAddWorkout = () => {
        this.props.history.push('/workout/' + this.props.match.params.date + '/add');
    }

    compareEntry = (a, b) => {
        return a.id - b.id
    }

    onAddBodyInfo = () => {
        if (this.state.addBodyInfo) {
            this.setState({
                addBodyInfo: false,
                bodyWeight: "",
                bodyFat: "",
                skeletalMuscle: ""
            })
        } else {
            this.setState({addBodyInfo: true});
        }
    }

    onConfirmBodyInfo = () => {
        if(this.state.bodyWeight<=0||this.state.bodyFat<=0||this.state.skeletalMuscle<=0){
            alert("Wrong Input! Input number should be larger than 0")
            this.setState({
                bodyWeight: "",
                bodyFat: "",
                skeletalMuscle: ""
            });
            return;
        }

        const data = {
            date: this.props.match.params.date,
            bodyWeight: this.state.bodyWeight,
            bodyFat: this.state.bodyFat,
            skeletalMuscle: this.state.skeletalMuscle
        }

        this.props.onAddBodyInfo(data)
        this.setState({addBodyInfo: false})
    }

    bodyInfoInput = () => {
        return (
            <div>
                <p><label>Body Weight(kg)</label>
                    <input id="bodyWeight-input" type="number" value={this.state.bodyWeight}
                           onChange={(event) => this.setState({bodyWeight: event.target.value})}/>
                </p>
                <p><label>Skeletal Muscle Mass(kg)</label>
                    <input id="smm-input" type="number" value={this.state.skeletalMuscle}
                           onChange={(event) => this.setState({skeletalMuscle: event.target.value})}/></p>
                <p><label>Body Fat Ratio(%)</label>
                    <input id="bodyFat-input" type="number" value={this.state.bodyFat}
                           onChange={(event) => this.setState({bodyFat: event.target.value})}/></p>
                <Button id="confirm-body-info-button" onClick={()=>this.onConfirmBodyInfo()}>Confirm</Button>

            </div>
        )
    }

    showBodyInfo = () => {
        return (
            <div>
                <h4>Body Weight(kg): {this.state.bodyWeight}</h4>
                <h4>Skeletal Muscle Mass(kg): {this.state.skeletalMuscle}</h4>
                <h4>Body Fat Ratio(%): {this.state.bodyFat}</h4>
            </div>
        )
    }

    onStartVoicePartner = ()=>{
        // Confirming the condition for starting the voice partner
        let existVoicePartner = false;
        for(let entry of this.props.workoutEntries){
            if(entry['isVoicePartner']&&entry['sets'].length!==0){
                existVoicePartner = true;
                break;
            }
        }

        if(!existVoicePartner){
            alert("Should check at least one exercise with more than one sets");
            return;
        }

        this.props.onStartVoicePartner(this.props.match.params.date);

    }

    onVoicePartner=()=>{

        if(this.state.currWav===-1){
            this.setState({currWav:0});
            return;
        }

        const voicePartner_entry = this.props.voicePartner[this.state.currWav]
        return (
            <div>
            <AudioPlayer
                header={(<h2>{voicePartner_entry.message}</h2>)}
                src={voicePartner_entry.url}
                autoPlay={true}
                showJumpControls={false}
                showSkipControls={true}
                onEnded={()=>this.onEndVoice()}
                onClickPrevious={e=>this.onPrevVoice()}
                onClickNext={(event)=>this.onNextVoice()}
            />
             <Button onClick={()=>this.onEndVoicePartner()}>End Voice Partner</Button>
            </div>
        )
    }

    onEndVoicePartner = () =>{
        this.setState({currWav: -1});
        this.props.onEndVoicePartner();
    }

    onEndVoice = ()=>{
        if(this.state.currWav===this.props.voicePartner.length-1) return;
        this.setState({currWav: this.state.currWav+1})
    }

    onNextVoice = () =>{
        console.log("Next Clicked!")
        if(this.state.currWav===this.props.voicePartner.length-1) return;
        this.setState({currWav: this.state.currWav+1})
    }

    onPrevVoice = ()=>{
        if(this.state.currWav===0) return;
        this.setState({currWav: this.state.currWav-1})
    }

    render() {

        let workoutEntries = []

        this.props.workoutEntries.sort(this.compareEntry)

        for (let entry of this.props.workoutEntries) {
            workoutEntries.push(<WorkoutEntry id={entry['id']} isVoicePartner={entry['isVoicePartner']}/>);
        }

        const date = this.props.match.params.date;

        const year = date.substring(0, 4);
        const month = date.substring(4, 6);
        const day = date.substring(6, 8);

        return (
            <Box p = {6} display = "flex" justifyContent="center" gap = {1}>
                <Box p = {1} display = "flex" flexDirection = "column" jutifyContent = "center" gap = {2}>
                    <Menu page = "workoutDetail"></Menu>
                    <IconButton id = "back_button" onClick={() => this.props.history.goBack()}>
                        <ArrowBackIcon></ArrowBackIcon>
                    </IconButton>
                </Box>
                <Box sx = {{width: "60%"}}>
                    <div className="WorkoutDetail" align="center">
                            <h1>Workout of {year + ". " + month + ". " + day}</h1>
                        {this.props.voicePartner.length===0?(<Button onClick={()=>this.onStartVoicePartner()}>Start Voice Partner</Button>):""}
                        {this.props.voicePartner.length>0?this.onVoicePartner():""}
                    <Button id="edit-body-info-button"
                        onClick={() => this.onAddBodyInfo()}>{this.state.addBodyInfo ? "Cancel" : "Edit Body Info for the Day"}</Button>
                    {this.state.addBodyInfo ? this.bodyInfoInput() : this.showBodyInfo()}
                    <Button id="add-workout-button" onClick={() => this.onAddWorkout()}>Add Exercise to workout</Button>
                    <hr/>
                    {workoutEntries}
                    </div>
                </Box>
            </Box>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onGetWorkout: (data) => dispatch(actionCreators.getWorkout(data)),
        onAddBodyInfo: (data) =>dispatch(actionCreators.addBodyInfo(data)),
        onGetBodyInfo: ()=> dispatch(actionCreators.getBodyInfo()),
        onStartVoicePartner: (date) => dispatch(actionCreators.startVoicePartner(date)),
        onEndVoicePartner: ()=>dispatch({type: actionTypes.END_VOICE_PARTNER})
    }
}

const mapStateToProps = (state) => {
    return {
        workoutEntries: state.workout.workoutEntries,
        bodyInfo: state.statistics.bodyInfo,
        voicePartner: state.workout.voicePartner,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkoutDetail));