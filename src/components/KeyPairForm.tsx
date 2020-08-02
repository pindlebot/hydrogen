import React from 'react'
import { Toolbar, Button, TextField, Grid } from '@material-ui/core'

import { makeStyles } from '@material-ui/styles'

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
  const { updateKeyPair, keyPair, history } = props
  const [state, setState] = React.useState(keyPair)

  const onChange = (key, evt) => {
    setState({
      ...state,
      [key]: evt.target.value
    })
  }

  const onSave = () => {
    updateKeyPair(state)
    history.push('/keys')
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          value={state.userId}
          onChange={evt => onChange('userId', evt)}
          fullWidth
          variant='outlined'
          label='User ID'
          margin='dense'
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          multiline
          rows={8}
          value={state.privateKey}
          onChange={evt => onChange('privateKey', evt)}
          fullWidth
          variant='outlined'
          label='private key'
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          multiline
          rows={8}
          value={state.publicKey}
          onChange={evt => onChange('publicKey', evt)}
          fullWidth
          variant='outlined'
          label='public key'
        />
      </Grid>
      <Grid item xs={12}>
        <Toolbar className={classes.toolbar}>
          <Button onClick={onSave}>Save</Button>
        </Toolbar>
      </Grid>
    </Grid>
  )
}

KeyPairForm.defaultProps = {
  keyPair: {
    userId: '',
    privateKey: '',
    publicKey: ''
  }
}

export default KeyPairForm
