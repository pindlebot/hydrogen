import React from 'react'
import { Paper } from '@material-ui/core'
import { connect } from 'react-redux'
import flowRight from 'lodash.flowright'
import { withRouter } from 'react-router-dom'

import { addPublicKey } from '../store'
import Layout from '../components/Layout'
import { makeStyles } from '@material-ui/styles'
import KeyPairForm from '../components/KeyPairForm'

const useStyles = makeStyles(theme => ({
  toolbar: {
    justifyContent: 'flex-end'
  },
  paper: {
    // @ts-ignore
    padding: theme.spacing(2) 
  }
}))

function ImportPublicKey (props) {
  const { addPublicKey, history } = props
  const classes = useStyles(props)

  const onSave = (key) => {
    addPublicKey(key)
    history.push('/')
  }

  return (
    <Layout>
      <Paper className={classes.paper}>
        <KeyPairForm {...props} onSave={onSave} disablePrivateKey />
      </Paper>
    </Layout>
  )
}

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = {
  addPublicKey
}

export default flowRight(
  [
    withRouter,
    connect(
      mapStateToProps,
      mapDispatchToProps
    )
  ]
)(ImportPublicKey)