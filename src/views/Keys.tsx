import React from 'react'
import { IconButton, Toolbar, Paper, List, Button, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core'
import { connect } from 'react-redux'
import flowRight from 'lodash.flowright'
import { withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import { Delete } from '@material-ui/icons'

import Layout from '../components/Layout'
import { addPrivateKey, updatePrivateKey, deletePrivateKey, deletePublicKey } from '../store'

const useStyles = makeStyles(theme => ({
  toolbar: {
    justifyContent: 'flex-end'
  },
  paper: {
    // @ts-ignore
    marginBottom: theme.spacing(3)
  }
}))

function KeyPairs (props) {
  const classes = useStyles()
  const { deletePrivateKey, deletePublicKey, history, privateKeys, publicKeys } = props
  
  const onAdd = () => {
    history.push('/keys/create')
  }

  const onEdit = (id) => () => {
    history.push(`/keys/${id}`)
  }

  const onGenerate = () => {
    history.push('/keys/generate')
  }

  const onImport = () => {
    history.push('/keys/import')
  }

  return ( 
    <Layout>
      <Paper className={classes.paper}>
        <List>
          {Object.values(privateKeys).map(key => {
            return (
              <ListItem button onClick={onEdit(key.fingerprint)} key={key.fingerprint}>
                <ListItemText primary={key.userId} secondary={key.fingerprint} />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => deletePrivateKey(key.fingerprint)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )
          })}
        </List>
        <Toolbar className={classes.toolbar}>
          <Button onClick={onGenerate}>Generate new key pair</Button>
          or 
          <Button onClick={onAdd}>create manually</Button>
        </Toolbar>
      </Paper>
      <Paper>
        <List>
          {Object.values(publicKeys).map(key => {
            return (
              <ListItem button key={key.fingerprint}>
                <ListItemText primary={key.userId} secondary={key.fingerprint} />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => deletePublicKey(key.fingerprint)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )
          })}
        </List>
        <Toolbar className={classes.toolbar}>
          <Button onClick={onImport}>Import public key</Button>
        </Toolbar>
      </Paper>
    </Layout>
  )
}

const mapDispatchToProps = {
  addPrivateKey,
  updatePrivateKey,
  deletePrivateKey,
  deletePublicKey
}

const mapStateToProps = state => state

export default flowRight([
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
])(KeyPairs)
