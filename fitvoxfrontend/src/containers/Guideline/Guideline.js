import React, { Component } from "react";
import {Box, Button, IconButton} from "@mui/material";
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
//import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));


class Guideline extends Component {

    state = {
        pageNumber: 0,
        pageName: "",
        open: false,
        maxPages: 1
    }

    componentDidMount() {
        this.setState({pageName: this.props.name})
    }

    BootstrapDialogTitle = (props) => {
        const { children, onClose, ...other } = props;
      
        return (
            <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
                {children}
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>
        );
    };

    handleClickOpen = () => {
        this.setState({open: true})
    }

    handleClose = () => {
        this.setState({open: false})
    }

    changePageNumber = (pivot) => {
        const newPageNumber = this.state.pageNumber + pivot
        this.setState({pageNumber: newPageNumber})
    }

    render() {
        return (
            <div>
                <IconButton onClick={this.handleClickOpen}><HelpOutlineIcon/></IconButton>
                <BootstrapDialog
                    onClose={this.handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.open}
                    fullWidth = {true}
                    maxWidth = {false}
                >
                    {this.BootstrapDialogTitle({children: "Guideline", onClose: this.handleClose})}
                    <DialogContent dividers>
                    <Box display = 'flex' flexDirection = "row" justifyContent="center" alignItems="center" gap = {0.5} >
                        <IconButton disabled = {this.state.pageNumber === 0? true: false}
                                    onClick = {() => this.changePageNumber(-1)}
                        >
                            <ChevronLeftIcon/>
                        </IconButton>
                        <Box display = "flex" justifyContent="center" alignItems = "center" sx = {{width: "90%"}}>
                            <img src = {"/Guideline/" + this.state.pageName + "/" + this.state.pageNumber + ".png"}/>
                        </Box>
                        <IconButton disabled = {this.state.pageNumber === this.state.maxPages-1? true : false}
                                    onClick = {() => this.changePageNumber(1)}
                        >
                            <ChevronRightIcon/>
                        </IconButton>
                    </Box>
                    </DialogContent>
                    <Box display = "flex" flexDirection="row" justifyContent = "center" alignItems="center">
                        <Box sx = {{width: "40%"}}>{""}</Box>
                        <Box display = "flex" justifyContent = "center" alignItems = "center" sx = {{width: "20%"}}>
                            <Typography>{"- " + (this.state.pageNumber+1) + "/" + this.state.maxPages + " -"}</Typography>
                        </Box>
                        <Box sx = {{width: "40%"}}>
                            <DialogActions>
                                <Button autoFocus onClick={this.handleClose}>
                                    Okay, Let's start
                                </Button>
                            </DialogActions>
                        </Box>  
                    </Box>
                </BootstrapDialog>
            </div> 
        )
    }
}

export default Guideline
