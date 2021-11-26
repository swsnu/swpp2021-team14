import React, {Component} from 'react';
import './ExerciseEntry.css'



class ExerciseEntry extends Component {
    render() {
        return (
            <div  className="ExerciseEntry" style={{border: '1px solid orange'}}>
                <div onClick={() => this.props.onClick()}>
                    <h2>{this.props.name}</h2>
                </div>
                <label><input type="checkbox" checked={this.props.isFavorite} onChange={()=>this.props.onCheck()} />Favorite</label>
            </div>
        );
    }
}

export default ExerciseEntry;