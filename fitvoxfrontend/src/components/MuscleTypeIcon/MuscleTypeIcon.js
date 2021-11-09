import React, {Component} from 'react';

class MuscleTypeIcon extends Component {
    render() {
        return (
            <div className="MuscleTypeIcon" onClick={() => this.props.onClick()} style={{border: '1px solid red'}}>
                <h2>{this.props.muscleType}</h2>
            </div>
        );
    }
}

export default MuscleTypeIcon;