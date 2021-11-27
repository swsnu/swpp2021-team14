import React, {Component} from 'react';
import './ExerciseEntry.css'
import { IconButton, Box } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';


class ExerciseEntry extends Component {
    render() {
        return (
            <div  className="ExerciseEntry" style={{border: '1px solid orange'}}>
                <Box display = "flex" justifyContent = "center" alignItems="center">
                    <Box sx ={{width: "50%"}}>
                        <div id = "button" onClick={() => this.props.onClick()}>
                            <h2>{this.props.name}</h2>
                        </div>
                    </Box>
                    <Box display = "flex" sx ={{width: "50%"}} justifyContent = "flex-end">
                        { 
                            this.props.isFavorite === true ? 
                            (<IconButton aria-label = "isFavorite" onClick = {() => this.props.onCheck()}>
                                <StarTwoToneIcon style = {{fill: 'gold', fontSize: 45}}/>
                            </IconButton>) :
                            (<IconButton aria-label = "isFavorite" onClick = {() => this.props.onCheck()}>
                                <StarBorderIcon style = {{fill: 'black', fontSize: 45}}/>
                            </IconButton>)
                        }
                    </Box>
                </Box>
            </div>
        );
    }
}

export default ExerciseEntry;