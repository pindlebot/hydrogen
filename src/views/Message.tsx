import React from 'react'
import { makeStyles } from '@material-ui/styles'
import {
  Grid,
  Paper,
  TextField,
  Toolbar,
  Button,
  InputAdornment,
  IconButton,
  Fade
} from '@material-ui/core'
import { connect } from 'react-redux'
import { Autocomplete } from '@material-ui/lab'
import { Visibility, VisibilityOff } from '@material-ui/icons'

import Layout from '../components/Layout'
import { RequestEvents, ResponseEvents } from '../fixtures'

const useStyles = makeStyles((theme) => ({
  field: {
    fontSize: 11
  },
  paper: {
    // @ts-ignore
    padding: theme.spacing(3)
  },
  toolbar: {
    justifyContent: 'flex-end'
  }
}))

type MessageProps = {
  privateKeys: {
    [key: string]: any
  },
  publicKeys: {
    [key: string]: any
  }
}

function Message(props: MessageProps) {
  const classes = useStyles(props)
  const [value, setValue] = React.useState('')
  const [passphrase, setPassphrase] = React.useState('')
  const [keyId, setKeyId] = React.useState('')
  const [recipientKeyId, setRecipientKeyId] = React.useState('')

  const [visible, setVisible] = React.useState(false)

  const { privateKeys, publicKeys } = props

  const isPgpMessage = React.useMemo(() => {
    return value.startsWith('-----BEGIN PGP MESSAGE-----')
  }, [value])

  const onChange = (evt) => setValue(evt.target.value)

  const onPassphraseChange = (evt) => setPassphrase(evt.target.value)

  const onClick = (evt: any) => {
    const privateKey = privateKeys[keyId]
    const publicKey = publicKeys[recipientKeyId]
    const payload = {
      passphrase,
      message: value,
      privateKey: privateKey.privateKey,
      publicKey: publicKey.publicKey
    }
    console.log(payload)
    // @ts-ignore
    const eventName = isPgpMessage ? RequestEvents.DECRYPT : RequestEvents.ENCRYPT
    ;(window as any).ipcRenderer.send(eventName, JSON.stringify(payload))
  }

  const onSenderChange = (evt, value) => {
    setKeyId(typeof value === 'string' ? value : value.value)
  }

  const onRecipientChange = (evt, value) => {
    setRecipientKeyId(typeof value === 'string' ? value : value.value)
  } 

  const onData = (event, args) => {
    const { data } = JSON.parse(args)
    setValue(data)
  }

  React.useEffect(() => {
    // @ts-ignore
    ;(window as any).ipcRenderer.on(ResponseEvents.DECRYPT, onData)
    ;(window as any).ipcRenderer.on(ResponseEvents.ENCRYPT, onData)
    return () => {
      ;(window as any).ipcRenderer.off(ResponseEvents.DECRYPT, onData)
      ;(window as any).ipcRenderer.off(ResponseEvents.ENCRYPT, onData)
    }
  }, [])

  const senderOptions = React.useMemo(() => {
    return Object.values(privateKeys).map(({ userId, fingerprint }) => ({ label: userId, value: fingerprint }))
  }, [privateKeys])

  const recipientOptions = React.useMemo(() => {
    return Object.values(privateKeys).map(({ userId, fingerprint }) => ({ label: userId, value: fingerprint }))
  }, [publicKeys])

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const toggleVisibility = () => {
    setVisible((v) => !v)
  }

  return (
    <Layout>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              options={senderOptions}
              getOptionLabel={(option: any) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Identity'
                  margin='dense'
                  variant='outlined'
                />
              )}
              onChange={onSenderChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant='outlined'
              margin='dense'
              value={passphrase}
              onChange={onPassphraseChange}
              label='Passphrase'
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
          <Grid item xs={12}>
            <TextField
              multiline
              rows={10}
              value={value}
              onChange={onChange}
              fullWidth
              variant='outlined'
              className={classes.field}
              label='Message'
            />
          </Grid>
          <Fade in={!isPgpMessage}>
            <Grid item xs={12}>
              <Autocomplete
                options={recipientOptions}
                getOptionLabel={(option: any) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Recipient'
                    margin='dense'
                    variant='outlined'
                  />
                )}
                onChange={onRecipientChange}
              />
            </Grid>
          </Fade>
          <Toolbar className={classes.toolbar}>
            <Button onClick={onClick}>
              {isPgpMessage ? 'Decrypt' : 'Encrypt'}
            </Button>
          </Toolbar>
        </Grid>
      </Paper>
    </Layout>
  )
}

const mapStateToProps = (state) => state

export default connect(mapStateToProps)(Message)
