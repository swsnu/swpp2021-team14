import React, {Component} from 'react';
import './ExerciseEnry.css'
class ExerciseEntry extends Component {
    render() {
        return (
            <div className="ExerciseEntry" onClick={() => this.props.onClick()} style={{border: '1px solid orange'}}>
                <h2>{this.props.name}</h2>
            </div>
        );
    }
}

export default ExerciseEntry;