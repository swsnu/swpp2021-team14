import React, {Component} from 'react';
import './ExerciseEntry.css'
import { IconButton, Box } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';


class ExerciseEntry extends Component {
    render() {
        console.log(this.props.name.replace(/ /g,'_').replace(/:/g, ''))
        return (
            <div  className="ExerciseEntry" style={{border: '1px solid orange'}}>
                <Box display = "flex" justifyContent = "center" alignItems="center">
                    <Box display = "flex" flexDirection = "row" sx ={{width: "80%"}} alignItems = "center" gap = {0.5} onClick={() => this.props.onClick()}>
                        <Box display = "flex" alignItems = "center" sx={{maxWidth: "45%"}}>
                            <img sx = {{maxWidth: "40%"}} 
                                src = {'/ExerciseEntryImage/'+this.props.name.replace(/ /g,'_').replace(/:/g, '').replace(/,/g, "").replace(/->/g, "To")+".png"}
                                alt = {""}
                                onError = {
                                    event => {
                                        event.target.src = '/ExerciseEntryImage/default.png'
                                        event.onerror = null
                                    }
                                }/>
                        </Box>
                        <Box sx = {{width: "60%"}}>
                            <div>
                                <h2>{this.props.name}</h2>
                            </div>
                        </Box>
                    </Box>
                    <Box display = "flex" sx ={{width: "20%"}} justifyContent = "flex-end">
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
