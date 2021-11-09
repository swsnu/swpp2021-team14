import React, {Component} from 'react';

class ExerciseTypeIcon extends Component {
    render() {
        return (
            <div className="ExerciseTypeIcon" onClick={() => this.props.onClick()} style={{border: '1px solid blue'}}>
                <h2>{this.props.exerciseType}</h2>
            </div>
        );
    }
}

export default ExerciseTypeIcon;