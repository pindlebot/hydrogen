import React from 'react'
import {
  IconButton,
  InputAdornment,
  Paper,
  Toolbar,
  Button,
  TextField,
  Grid
} from '@material-ui/core'
import { connect } from 'react-redux'
import flowRight from 'lodash.flowright'
import { withRouter } from 'react-router-dom'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { addPrivateKey, addPublicKey } from '../store'
import Layout from '../components/Layout'
import { makeStyles } from '@material-ui/styles'
import { RequestEvents, ResponseEvents } from '../fixtures'

const useStyles = makeStyles((theme) => ({
  toolbar: {
    justifyContent: 'flex-end'
  },
  paper: {
    // @ts-ignore
    padding: theme.spacing(2)
  }
}))

function GenerateKeyPair(props) {
  const classes = useStyles(props)
  const { addPrivateKey, addPublicKey, history } = props
  const [state, setState] = React.useState({
    userId: '',
    passphrase: ''
  })
  const [visible, setVisible] = React.useState(false)

  const onChange = (key, evt) => {
    setState({
      ...state,
      [key]: evt.target.value
    })
  }

  const onGerate = () => {
    // @ts-ignore
    window.ipcRenderer.send(
      RequestEvents.GENERATE_KEY_PAIR,
      JSON.stringify({
        userIds: [state.userId],
        passphrase: state.passphrase
      })
    )
  }

  const onData = (event, args) => {
    const data = JSON.parse(args)
    const { privateKey, publicKey, ...rest } = data
    addPrivateKey({ privateKey, ...rest })
    addPublicKey({ publicKey, ...rest })
    history.push('/')
  }

  React.useEffect(() => {
    (window as any).ipcRenderer.on(ResponseEvents.GENERATE_KEY_PAIR, onData)

    return () => {
      (window as any).ipcRenderer.off(ResponseEvents.GENERATE_KEY_PAIR, onData)
    }
  }, [])

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const toggleVisibility = () => {
    setVisible((v) => !v)
  }

  return (
    <Layout>
      <Paper className={classes.paper}>
        <Grid spacing={2}>
          <Grid xs={12}>
            <TextField
              value={state.userId}
              onChange={(evt) => onChange('userId', evt)}
              fullWidth
              variant='outlined'
              label='User ID'
              margin='dense'
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              value={state.passphrase}
              onChange={(evt) => onChange('passphrase', evt)}
              fullWidth
              variant='outlined'
              label='Passphrase'
              margin='dense'
              InputProps={{
                type: visible ? 'text' : 'password',
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={toggleVisibility}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {visible ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
        <Grid xs={12}>
          <Toolbar>
            <Button onClick={onGerate}>Generate</Button>
          </Toolbar>
        </Grid>
      </Paper>
    </Layout>
  )
}

GenerateKeyPair.defaultProps = {}

const mapDispatchToProps = {
  addPrivateKey,
  addPublicKey
}

export default flowRight([withRouter, connect(null, mapDispatchToProps)])(
  GenerateKeyPair
)
