import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Grid, Paper, TextField, Toolbar, Box, Button } from '@material-ui/core'
import { connect } from 'react-redux'
import { Autocomplete } from '@material-ui/lab'

import Layout from '../components/Layout'

const useStyles = makeStyles(theme => ({
  field: {
    fontSize: 11
  },
  paper: {
    // @ts-ignore
    padding: theme.spacing(2)
  },
  toolbar: {
    justifyContent: 'flex-end'
  }
}))

function Message (props) {
  const classes = useStyles(props)
  const [value, setValue] = React.useState('')
  const [passphrase, setPassphrase] = React.useState('')
  const [keyId, setKeyId] = React.useState('')
  const { keyPairs } = props

  const isEncrypted = React.useMemo(() => {
    return value.startsWith('-----BEGIN PGP MESSAGE-----')
  }, [value])

  const onChange = evt => setValue(evt.target.value)
 
  const onPassphraseChange = evt => setPassphrase(evt.target.value)
   
  const onClick = evt => {
    const keyPair = keyPairs.find(key => key.id === keyId)
    const payload = {
      message: value,
      keyPair,
      passphrase
    }

    const action = isEncrypted ? 'DECRYPT' : 'ENCRYPT'
    // @ts-ignore
    window.ipcRenderer.send('put', JSON.stringify({ action, data: payload }))
  }
  
  const onAutocompleteChange = (evt, value) => {
    console.log(value)
    setKeyId(typeof value === 'string' ? value : value.value)
  }

  React.useEffect(() => {
    // @ts-ignore
    window.ipcRenderer.on('data', (event, args) => {
      const { data } = JSON.parse(args)
      setValue(data)
    })
  }, [])

  const options = React.useMemo(() => {
    return keyPairs.map(({ userId, id }) => ({ label: userId, value: id }))
  }, [keyPairs])

  return (
    <Layout>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              options={options}
              getOptionLabel={(option: any) => option.label}
              renderInput={(params) => <TextField {...params} margin='dense' variant='outlined' />}
              onChange={onAutocompleteChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant='outlined'
              margin='dense'
              value={passphrase}
              onChange={onPassphraseChange}
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
          <Toolbar className={classes.toolbar}>
            <Button onClick={onClick}>{isEncrypted ? 'Decrypt' : 'Encrypt'}</Button>
          </Toolbar>
        </Grid>
      </Paper>
    </Layout>
  )
}

const mapStateToProps = state => state

export default connect(
  mapStateToProps 
)(Message)
