import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import {withRouter} from 'react-router';
import {Button} from "@mui/material";
import './SetEntry.css'

class SetEntry extends Component {

    state = {
        editMode: false,
        weight: this.props.weight,
        repetition: this.props.repetition,
        minute: parseInt(this.props.breaktime / 60),
        second: this.props.breaktime % 60
    }

    onEditMode = () => {
        if (this.state.editMode) {
            this.setState({
                    editMode: false,
                    weight: this.props.weight,
                    repetition: this.props.repetition,
                    minute: parseInt(this.props.breaktime / 60),
                    second: this.props.breaktime % 60
                }
            )
        } else {
            this.setState({editMode: true});
        }
    }

    onDeleteSet = () => {
        this.props.onDeleteSet(this.props.id);
    }

    onConfirmEdit = () => {
        if (this.state.minute < 0 || this.state.second >= 60 || this.state.second < 0 || this.state.repetition < 0 || this.state.weight < 0) {
            alert("Wrong Input! Weight, Repetition, Second shouldn't be negative. Second should be between 0 and 59");
            return;
        }
        const data = {
            id: this.props.id,
            weight: this.state.weight,
            repetition: this.state.repetition,
            breaktime: this.state.minute * 60 + this.state.second
        }
        this.props.onConfirmEditSet(data);
        this.setState({editMode: false})
    }

    setInfo = ()=>{return (
        <div className="SetInfo"><h4>Weight: {this.state.weight}kg </h4><h4>Repetition: {this.state.repetition}  </h4>
            <h4>Break
                time: {this.state.minute} min, {this.state.second} sec</h4>
        </div>
    )};

    editSetInfo = () => {
        return (
            <div>
                <p><label>Weight</label>
                    <input id="weight-input" type="number" value={this.state.weight}
                           onChange={(event) => this.setState({weight: event.target.value})}/>
                </p>
                <p><label>Repetition</label>
                    <input id="rep-input" type="number" value={this.state.repetition}
                           onChange={(event) => this.setState({repetition: event.target.value})}/></p>
                <div>
                    <p><label>Break Time</label></p>
                    <p><label>Minute</label>
                        <input id="min-input" type="number" value={this.state.minute}
                               onChange={(event) => this.setState({minute: event.target.value})}/></p>
                    <p><label>Second</label>
                        <input id="sec-input" type="number" value={this.state.second}
                               onChange={(event) => this.setState({second: event.target.value})}/></p>
                </div>
                <Button id="confirm-edit-button" onClick={() => this.onConfirmEdit()}>Confirm Edit</Button>
            </div>
        );
    }

    render() {
        return (
            <div className="SetEntry" style={{border: '1px solid orange'}}>
                <h3>Set {this.props.set_number}</h3>
                <Button id="Delete-set-button" onClick={()=>this.onDeleteSet()}>Delete</Button>
                <Button id="Edit-mode-button" onClick={() => this.onEditMode()}>{this.state.editMode ? "Cancel" : "Edit"}</Button>
                {this.state.editMode ? this.editSetInfo() : this.setInfo()}
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onConfirmEditSet: (data) => dispatch(actionCreators.editSet(data)),
        onDeleteSet: (id) => dispatch(actionCreators.deleteSet(id))
    }
}

export default connect(null, mapDispatchToProps)(withRouter(SetEntry));