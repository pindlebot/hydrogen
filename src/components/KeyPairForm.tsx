import React from 'react'
import { Toolbar, Button, TextField, Grid } from '@material-ui/core'

import { makeStyles } from '@material-ui/styles'
import { RequestEvents, ResponseEvents } from '../fixtures'

const useStyles = makeStyles(theme => ({
  toolbar: {
    justifyContent: 'flex-end'
  },
  paper: {
    // @ts-ignore
    padding: theme.spacing(2) 
  }
}))

function KeyPairForm (props) {
  const classes = useStyles(props)
  const { disablePrivateKey, privateKey: _privateKey, history, onSave } = props
  const [privateKey, setPrivateKey] = React.useState(_privateKey.privateKey)
  const [publicKey, setPublicKey] = React.useState(_privateKey.publicKey)
  const [metadata, setMetadata] = React.useState({
    userId: _privateKey.userId,
    fingerprint: _privateKey.fingerprint
  })

  const ref = React.useRef('')

  const onPrivateKeyChange = evt => {
    const value = evt.target.value
    ref.current = value
    setPrivateKey(value)
  }

  const onPublicKeyChange = evt => {
    const value = evt.target.value
    ref.current = value
    setPublicKey(value)
  }

  const onClickSave = () => {
    onSave({
      ...metadata,
      privateKey,
      publicKey
    })
  }

  const onCancel = () => {
    history.push('/')
  }

  const onGetMetadata = (event, args) => {
    const { fingerprint, userId } = JSON.parse(args)
    setMetadata({ fingerprint, userId })
  }

  React.useEffect(() => {
    ;(window as any).ipcRenderer.on(ResponseEvents.GET_METADATA, onGetMetadata)

    return () => {
      ;(window as any).ipcRenderer.off(ResponseEvents.GET_METADATA, onGetMetadata)
    }
  }, [])

  const onPaste = (evt) => {
    const text = (window as any).electronClipboard.readText()
    ;(window as any).ipcRenderer.send(RequestEvents.GET_METADATA, JSON.stringify({
      armoredText: text
    }))
  }

  return (
    <Grid container spacing={2}>
      {!disablePrivateKey && (
        <Grid item xs={12}>
          <TextField
            multiline
            rows={8}
            value={privateKey}
            onChange={onPrivateKeyChange}
            fullWidth
            variant='outlined'
            label='private key'
            onPaste={onPaste}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <TextField
          multiline
          rows={8}
          value={publicKey}
          onChange={onPublicKeyChange}
          fullWidth
          variant='outlined'
          label='public key'
          onPaste={onPaste}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={metadata.userId}
          fullWidth
          variant='outlined'
          label='User ID'
          margin='dense'
          disabled
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={metadata.fingerprint}
          fullWidth
          variant='outlined'
          label='Fingerprint'
          margin='dense'
          disabled
        />
      </Grid>
      <Grid item xs={12}>
        <Toolbar className={classes.toolbar}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onClickSave}>Save</Button>
        </Toolbar>
      </Grid>
    </Grid>
  )
}

KeyPairForm.defaultProps = {
  disablePrivateKey: false,
  privateKey: {
    userId: '',
    fingerprint: '',
    privateKey: '',
    publicKey: ''
  }
}

export default KeyPairForm
