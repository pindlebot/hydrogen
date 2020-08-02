import React from 'react'
import { Paper, Toolbar, Button, TextField, Grid } from '@material-ui/core'
import { connect } from 'react-redux'
import flowRight from 'lodash.flowright'
import { withRouter } from 'react-router-dom'

import { addKeyPair } from '../store'
import Layout from '../components/Layout'
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

function GenerateKeyPair (props) {
  const classes = useStyles(props)
  const { addKeyPair, history } = props
  const [state, setState] = React.useState({
    userId: '',
    passphrase: ''
  })

  const onChange = (key, evt) => {
    setState({
      ...state,
      [key]: evt.target.value
    })
  }

  const onGerate = () => {
     // @ts-ignore
     window.ipcRenderer.send('put', JSON.stringify({
       action: 'GENERATE_KEY_PAIR',
       data: {
         userIds: [state.userId],
         passphrase: state.passphrase
       }
     }))
  }

  React.useEffect(() => {
    // @ts-ignore
    window.ipcRenderer.on('data', (event, args) => {
      console.log({ event, args })
      const data = JSON.parse(args)
      const { publicKeyArmored, privateKeyArmored } = data
      addKeyPair({
        userId: state.userId,
        publicKey: publicKeyArmored,
        privateKey: privateKeyArmored
      })
      history.push('/keys')
    })
  }, [])

  return (
    <Layout>
      <Paper className={classes.paper}>
        <Grid spacing={2}>
          <Grid xs={12}>
            <TextField
              value={state.userId}
              onChange={evt => onChange('userId', evt)}
              fullWidth
              variant='outlined'
              label='User ID'
              margin='dense'
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              value={state.passphrase}
              onChange={evt => onChange('passphrase', evt)}
              fullWidth
              variant='outlined'
              label='Passphrase'
              margin='dense'
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
  addKeyPair
}

export default flowRight(
  [
    withRouter,
    connect(
      null,
      mapDispatchToProps
    )
  ]
)(GenerateKeyPair)