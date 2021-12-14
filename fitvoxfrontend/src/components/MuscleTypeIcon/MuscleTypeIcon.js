import React, {Component} from 'react';
import './MuscleTypeIcon.css'
class MuscleTypeIcon extends Component {
    render() {
        return (
            <div className="MuscleTypeIcon" onClick={() => this.props.onClick()} style={{border: '1px solid red'}}>
                <div className="iamge"><img src = {'/MuscleTypeImage/'+this.props.muscleType+".png"}/></div>
                <div><h2><span>{this.props.muscleType}</span></h2></div>
                
            </div>
        );
    }
}

export default MuscleTypeIcon;