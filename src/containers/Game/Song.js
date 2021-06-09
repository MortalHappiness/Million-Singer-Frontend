import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

import ButtonGroup from "@material-ui/core/ButtonGroup";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";

import {
  useButtonStyles,
  useBarStyles,
  useTypoStyles,
  useBackgroundStyles,
} from "../../styles";

const lyric_styles = {
  main: {
    color: "#cab1f6",
    fontSize: 30,
    fontFamily: "DejaVu Sans Mono, monospace",
    fontStyle: "normal",
  },
  front: {
    fontSize: 20,
    fontFamily: "DejaVu Sans Mono, monospace",
    fontStyle: "normal",
    color: "#404040",
  },
  behind: {
    fontSize: 20,
    fontFamily: "DejaVu Sans Mono, monospace",
    fontStyle: "normal",
    color: "#404040",
  },
};

const botton_styles = {
  main: {
    display: "inline-block",
    color: "white",
  },
  other: {
    display: "inline-block",
    color: "white",
  },
};

const lyrics_box_styles = {
  root: {
    backgroundClasses: "white",
    marginLeft: "25%",
    marginRight: "25%",
    borderRadius: 20,
    boxShadow: "none",
  },
  transparent: {
    marginTop: "7%",
  },
};

function renderHiddenAnswerLine(cur_line) {
  let line = "";
  for (let i = 0; i < cur_line.length; i++) {
    if (cur_line[i] !== " ") {
      line += "\u2B50";
    } else {
      line += " ";
    }
  }
  return line;
}

export default function Song({ song }) {
  //menu and style
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const buttonClasses = useButtonStyles();
  const typoClasses = useTypoStyles();
  const barClasses = useBarStyles();
  const backgroundClasses = useBackgroundStyles();

  const YT = window.YT;
  const player = useRef(null);

  const [prevLine, setPrevLine] = useState("");
  const [line, setLine] = useState("");
  const [nextLine, setNextLine] = useState("");
  const answerLine = useRef("");
  const afterMissLyrics = useRef(false);
  const [showContinuePlay, setShowContinuePlay] = useState(false);
  const [missLyrics, setMissLyrics] = useState(false);
  const [isNotStart, setIsNotStart] = useState(true);

  const isPaused = () =>
    player.current.getPlayerState() === YT.PlayerState.PAUSED;

  const showTime = () => {
    let currentLineIndex = 0;
    setInterval(() => {
      if (!isPaused()) {
        const currentTime = player.current.getCurrentTime() * 1000;
        let idx = -1;
        if (currentTime > song.lyrics[currentLineIndex].end_time) {
          currentLineIndex += 1;
        }
        idx = currentLineIndex;
        if (currentTime < song.lyrics[0].start_time) {
          idx = -1;
        }
        if (idx >= 0) {
          if (idx > 0) {
            setPrevLine(song.lyrics[idx - 1].line);
          }
          if (idx + 1 < song.lyrics.length) {
            setNextLine(song.lyrics[idx + 1].line);
          }
          setLine(song.lyrics[idx].line);
          if (idx + 1 === song.miss_lyric_id) {
            setNextLine(answerLine.current);
          }
        }
        if (!afterMissLyrics.current && idx === song.miss_lyric_id) {
          setMissLyrics(true);
          setShowContinuePlay(true);
          setLine(answerLine.current);
          player.current.pauseVideo();
        }
      }
    }, 10);
  };

  const onPlayerReady = () => {
    player.current.playVideo();
    setLine("♪♪ Music ♪♪");
    setNextLine(song.lyrics[0].line);
    answerLine.current = renderHiddenAnswerLine(
      song.lyrics[song.miss_lyric_id].line
    );
    showTime();
  };

  const initYoutube = () => {
    player.current = new YT.Player("player", {
      width: 960,
      height: 640,
      videoId: song.video_id,
      playerVars: {
        cc_load_policy: 0,
      },
      events: {
        onReady: onPlayerReady,
      },
    });
  };

  const playVideo = () => {
    initYoutube();
    setIsNotStart(false);
  };

  const showMissLyrics = () => {
    setLine(song.lyrics[song.miss_lyric_id].line);
    setMissLyrics(false);
  };
  const continuePlaying = () => {
    setShowContinuePlay(false);
    player.current.playVideo();
    showTime();
    afterMissLyrics.current = true;
  };

  return (
    <Box>
      <Box
        position="relative"
        height="95vh"
        display="flex"
        flexDirection="column"
        className={backgroundClasses.dark}
      >
        <div>
          {song && (
            <h2 className={typoClasses.songheader}>
              {song.name} - {song.singer}
            </h2>
          )}
          <div id="player" />
          {isNotStart && (
            <IconButton variant="secondary" onClick={playVideo}>
              <PlayCircleOutlineIcon fontSize={"large"} />
            </IconButton>
          )}

          <Box style={lyrics_box_styles.transparent}></Box>
          <Box
            style={lyrics_box_styles.root}
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Typography variant="subtitle1" style={lyric_styles.front}>
              {prevLine}
            </Typography>

            <Typography variant="subtitle1" style={lyric_styles.main}>
              {line}
            </Typography>

            <Typography variant="subtitle1" style={lyric_styles.behind}>
              {nextLine}
            </Typography>
          </Box>

          <ButtonGroup>
            {missLyrics && (
              <Button
                variant="contained"
                color="primary"
                style={botton_styles.main}
                onClick={showMissLyrics}
              >
                Show Answer
              </Button>
            )}
            {showContinuePlay && (
              <Button
                variant="contained"
                color="primary"
                style={botton_styles.other}
                onClick={continuePlaying}
              >
                Continue Playing
              </Button>
            )}
          </ButtonGroup>
        </div>
      </Box>
      <Box>
        <div className={barClasses.above}>
          <AppBar position="static" style={{ background: "#460625" }}>
            <Toolbar variant="dense">
              <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MenuIcon className={barClasses.menubutton} />
              </IconButton>

              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/">
                  Home
                </MenuItem>
                <MenuItem component={Link} to="/TourSelect">
                  Select Tournament
                </MenuItem>
                <MenuItem component={Link} to="/Edit">
                  Edit Your Game
                </MenuItem>
              </Menu>

              <b className={typoClasses.sign}>CNL gourp #7</b>

              <div className={barClasses.loginbutton}>
                <Button className={buttonClasses.white}>login</Button>
              </div>
            </Toolbar>
          </AppBar>
        </div>
      </Box>
    </Box>
  );
}