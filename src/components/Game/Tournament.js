import React, { useState, useEffect } from "react";

import { SERVER_URL } from "../../constants.json";
import Button from "@material-ui/core/Button";

import { Link } from "react-router-dom";

//
import img from "../bg.jpg";
import img_light from "../bg_light.jpg";
import img_dark from "../bg_dark.jpg";

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { positions } from '@material-ui/system';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from '@material-ui/core/Typography';
import { Container } from "@material-ui/core";

import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import MusicIcon from '@material-ui/icons/AlbumTwoTone';
//Styles
const button_styles = makeStyles({
  blue: {
    background: '#a994f0',
    border: 0,
    borderRadius: 6,
    color: '#white',
    height: 48,
    padding: '0 30px',
    margin: 32,
    fontSize: 30,
    fontFamily: 'monospace',
  },
  white: {
    fontFamily: 'monospace',
    fontSize: 20,
    color: 'white',
  }
});

const bar_styles = makeStyles((theme) => ({
  above: {
    flexGrow: 1,
    color: "#283747",
  },
  loginbutton: {
    marginLeft: 'auto',
  },
  menubutton: {
    color: 'white'
  }
}));

const typo_styles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(1),

    color: 'white',
    fontSize: 150,
    fontFamily: 'DejaVu Sans Mono, monospace',
    fontStyle: 'normal',
  },
  sign: {
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 20,
    fontFamily: 'DejaVu Sans Mono, monospace',
    fontStyle: 'normal',
  },
  subheader: {
    padding: theme.spacing(1),

    color: 'white',
    fontSize: 60,
    fontFamily: 'DejaVu Sans Mono, monospace',
    fontStyle: 'normal',
  }
}));

const background_styles = {
  main: {
    backgroundImage: `url(${img})`,
    width: '100%',
  },
  light: {
    backgroundImage: `url(${img_light})`,
    width: '100%',
  },
  dark: {
    backgroundImage: `url(${img_dark})`,
    width: '100%',
  },
};
//

export default function Tournament({ tourID, updatePlayCollect }) {
  const [collects, setCollects] = useState([]);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/game/tours/${tourID}`)
      .then((res) => res.json())
      .then((json) => {
        setCollects(json.data.collects);
      })
      .catch((e) => console.error(e));
  }, [tourID]);

  const fetchCollectSongs = (collectID) => {
    fetch(`${SERVER_URL}/api/game/collects/${collectID}`)
      .then((res) => res.json())
      .then((json) => {
        updatePlayCollect(json.data);
      })
      .catch((e) => console.error(e));
  };

  //menu
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const tourselect = () => {
    setAnchorEl(null);
  };
  //
  const button = button_styles();
  const typo = typo_styles();
  const bar = bar_styles();
  //

  return (
    <>
      <Box position="relative"
        height="95vh"
        display="flex"
        flexDirection="column"
        style={background_styles.dark}>

        <div>
          <h2 className={typo.subheader}>Tournament #{tourID}</h2>
          {collects.map((collect) => (
            <Button
              startIcon={<MusicIcon fontSize={'large'} color='white' />}
              onClick={() => fetchCollectSongs(collect.id)}
              variant="contained"
              color="primary"
            >
              {collect.title}
            </Button>
          ))}
        </div>
      </Box>
      <Box>
        <div className={bar.above}>
          <AppBar
            position="static"
            style={{ background: '#460625' }}>
            <Toolbar variant="dense">
              <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                className>
                <MenuIcon className={bar.menubutton} />
              </IconButton>

              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  component={Link}
                  to="/">
                  Home
            </MenuItem>
                <MenuItem
                  component={Link}
                  to="/TourSelect">
                  Select Tournament
            </MenuItem>
                <MenuItem
                  component={Link}
                  to="/Edit">
                  Edit Your Game
              </MenuItem>
              </Menu>

              <b className={typo.sign}>
                CNL gourp #7
          </b>

              <div className={bar.loginbutton}>
                <Button className={button.white}>
                  login
          </Button>
              </div>
            </Toolbar>
          </AppBar>
        </div>
      </Box>
    </>
  );
}
