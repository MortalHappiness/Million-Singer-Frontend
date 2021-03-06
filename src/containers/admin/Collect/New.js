import React, { useState, useEffect, useRef, useCallback } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import FormHelperText from "@material-ui/core/FormHelperText";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Divider from "@material-ui/core/Divider";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import Loading from "../../../components/Loading";

import { SERVER_URL } from "../../../constants.json";

// ========================================

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  errorMsg: {
    textAlign: "center",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  dialogTitle: {
    textAlign: "center",
  },
}));

export default function CollectNew() {
  const classes = useStyles();
  const [songs, setSongs] = useState(null);

  // Fetch songs
  useEffect(() => {
    fetch(`${SERVER_URL}/api/game/songs`)
      .then((res) => res.json())
      .then((json) => {
        const data = json.data;
        data.forEach((song) => {
          song.selected = false;
        });
        setSongs(data);
      })
      .catch((e) => console.error(e));
  }, []);

  // ========================================
  // Handle input fields

  const [state, setState] = useState({
    title: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    setState({
      ...state,
      [name]: e.target.value,
    });
  };

  const handleCheckboxChange = (idx) => (e) => {
    const newSongs = [...songs];
    const newSong = { ...songs[idx] };
    newSong.selected = e.target.checked;
    newSongs[idx] = newSong;
    setSongs(newSongs);
  };

  // ========================================
  // Dialog control (Success dialog)
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const handleDialogClose = () => {
    setDialogIsOpen(false);
  };

  // ========================================

  // Handle submit
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  // set isMounted to false when we unmount the component
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (isSending) return;
      setIsSending(true);
      try {
        const res = await fetch(`${SERVER_URL}/api/game/collects/new`, {
          method: "POST",
          body: JSON.stringify({
            title: state.title,
            songs: songs.filter((song) => song.selected).map((song) => song.id),
          }),
          headers: {
            "content-type": "application/json",
          },
        });
        if (res.ok) {
          setDialogIsOpen(true);
        } else {
          throw new Error("Invalid format");
        }
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        if (isMounted.current) setIsSending(false);
        setState({ ...state, title: "" });
      }
    },
    [isSending, state, songs]
  );

  // ========================================

  return songs ? (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          New Collect
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            error={Boolean(error)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            value={state.title}
            onChange={handleChange}
          />
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Songs</FormLabel>
            <FormGroup>
              {songs.map((song, idx) => (
                <FormControlLabel
                  key={song.id}
                  control={
                    <Checkbox
                      checked={songs[idx].selected}
                      onChange={handleCheckboxChange(idx)}
                      name={song.name}
                    />
                  }
                  label={`${song.name} - ${song.singer}`}
                />
              ))}
            </FormGroup>
          </FormControl>
          <FormHelperText error={Boolean(error)} className={classes.errorMsg}>
            {error}
          </FormHelperText>
          <Button
            type="submit"
            disabled={isSending}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      </div>
      <Dialog
        aria-label="dialog"
        open={dialogIsOpen}
        fullWidth
        maxWidth="xs"
        onClose={handleDialogClose}
      >
        <DialogTitle className={classes.dialogTitle}>
          <b>Success!</b>
        </DialogTitle>
        <Divider />
        <DialogActions>
          <Button
            autoFocus
            fullWidth
            onClick={handleDialogClose}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  ) : (
    <Loading />
  );
}
