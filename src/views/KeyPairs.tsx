import React from 'react'
import Layout from '../components/Layout'
import { IconButton, Toolbar, Paper, List, Button, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core'
import { connect } from 'react-redux'
import { addKeyPair, updateKeyPair, deleteKeyPair } from '../store'
import flowRight from 'lodash.flowright'
import { withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import { Delete } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  toolbar: {
    justifyContent: 'flex-end'
  }
}))

function KeyPairs (props) {
  const classes = useStyles()
  const { addKeyPair, deleteKeyPair, history, keyPairs } = props
  const onAdd = () => {
    addKeyPair()
  }

  const onEdit = (id) => () => {
    history.push(`/keys/${id}`)
  }

  const onGenerate = () => {
    history.push('/keys/generate')
  }

  return ( 
    <Layout>
      <Paper>
        <List>
          {keyPairs.map(keyPair => {
            return (
              <ListItem button onClick={onEdit(keyPair.id)}>
                <ListItemText primary={keyPair.userId} secondary={keyPair.id} />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => deleteKeyPair(keyPair.id)}>
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
    </Layout>
  )
}

const mapDispatchToProps = {
  addKeyPair,
  updateKeyPair,
  deleteKeyPair
}

const mapStateToProps = state => state

export default flowRight([
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
])(KeyPairs)
