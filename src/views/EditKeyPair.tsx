import React from 'react'
import { Paper } from '@material-ui/core'
import { connect } from 'react-redux'
import flowRight from 'lodash.flowright'
import { withRouter } from 'react-router-dom'

import { updateKeyPair } from '../store'
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

function EditKeyPair (props) {
  const classes = useStyles(props)

  return (
    <Layout>
      <Paper className={classes.paper}>
        <KeyPairForm {...props} />
      </Paper>
    </Layout>
  )
}

EditKeyPair.defaultProps = {
  keyPair: {
    userId: '',
    privateKey: '',
    publicKey: ''
  }
}

const mapStateToProps = (state, ownProps) => {
  const { keyPairs } = state
  const { match: { params: { id } } } = ownProps
  const keyPair = keyPairs.find(keyPair => keyPair.id === id)
  return {
    keyPair
  }
}

const mapDispatchToProps = {
  updateKeyPair
}

export default flowRight(
  [
    withRouter,
    connect(
      mapStateToProps,
      mapDispatchToProps
    )
  ]
)(EditKeyPair)