import React, {Component} from 'react';
import './ExerciseTypeIcon.css';

class ExerciseTypeIcon extends Component {
    render() {
        return (
            <div className="ExerciseTypeIcon" onClick={() => this.props.onClick()} style={{border: '1px solid blue'}}>
                <div className = "image">
                    <img src = {'/ExerciseTypeImage/'+this.props.muscleType+"/"+this.props.exerciseType.replace(/ /g,'_')+".png"}
                        alt = {""}
                        onError = {
                            event => {
                                event.target.src = '/ExerciseTypeImage/default.png'
                                event.onerror = null
                            }
                        }/>
                </div>
                <div><h2><span>{this.props.exerciseType}</span></h2></div>
            </div>
        );
    }
}

export default ExerciseTypeIcon;