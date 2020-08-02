import React from 'react'
import { Paper } from '@material-ui/core'
import { connect } from 'react-redux'
import flowRight from 'lodash.flowright'
import { withRouter } from 'react-router-dom'

import { updatePrivateKey, updatePublicKey } from '../store'
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

function CreateKeyPair (props) {
  const { updatePrivateKey, updatePublicKey, history } = props
  const classes = useStyles(props)

  const onSave = ({ privateKey, publicKey, ...rest }) => {
    updatePrivateKey({ ...rest, privateKey })
    updatePublicKey({ ...rest, publicKey})
    history.push('/')
  }

  return (
    <Layout>
      <Paper className={classes.paper}>
        <KeyPairForm {...props} onSave={onSave} />
      </Paper>
    </Layout>
  )
}

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = {
  updatePrivateKey,
  updatePublicKey
}

export default flowRight(
  [
    withRouter,
    connect(
      mapStateToProps,
      mapDispatchToProps
    )
  ]
)(CreateKeyPair)