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
        open: false,
        maxPages: 3
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
                >
                    {this.BootstrapDialogTitle({children: "Guideline", onClose: this.handleClose})}
                    <DialogContent dividers>
                    <Box display = 'flex' flexDirection = "row" justifyContent="center" alignItems="center" gap = {0.5} >
                        <IconButton disabled = {this.state.pageNumber === 0? true: false}
                                    onClick = {() => this.changePageNumber(-1)}
                        >
                            <ChevronLeftIcon/>
                        </IconButton>
                        <Box sx = {{width: "90%"}}>
                                <img src = {"MuscleTypeImage/Neck.png"}/>
                                <Typography gutterBottom>
                                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                                    consectetur ac, vestibulum at eros.
                                </Typography>
                                <Typography gutterBottom>
                                    Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
                                    Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
                                </Typography>
                                <Typography gutterBottom>
                                    Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
                                    magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
                                    ullamcorper nulla non metus auctor fringilla.
                                </Typography>
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