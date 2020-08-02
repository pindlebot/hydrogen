import React from 'react'
import {
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
  Box
} from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { rehydrateState } from '../store'
import flowRight from 'lodash.flowright'
import { makeStyles } from '@material-ui/styles'

const Envelope = props => (
  <svg width="24" height="24" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path fill="currentColor" d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z">
    </path>
  </svg>
)

const SkeletonKey = props => (
  <svg width="24" height="24" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="key-skeleton" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path fill="currentColor" d="M448 0H320c-35.35 0-64 28.65-64 64v153.6L4.69 468.91c-6.25 6.25-6.25 16.38 0 22.63l15.77 15.77c6.25 6.25 16.38 6.25 22.63 0l36.25-36.25 36.11 36.11c6.25 6.25 16.38 6.25 22.63 0l43.16-43.16c6.25-6.25 6.25-16.38 0-22.63l-36.11-36.11L176 374.4l36.91 36.91c6.25 6.25 16.38 6.25 22.63 0l15.77-15.77c6.25-6.25 6.25-16.38 0-22.63L214.4 336l80-80H448c35.35 0 64-28.65 64-64V64c0-35.35-28.65-64-64-64zm-73.37 182.63c-12.5 12.5-32.76 12.5-45.26 0s-12.5-32.76 0-45.25c12.5-12.5 32.76-12.5 45.26 0 12.49 12.49 12.49 32.75 0 45.25zm64-64c-12.5 12.5-32.76 12.5-45.26 0s-12.5-32.76 0-45.25c12.5-12.5 32.76-12.5 45.26 0 12.49 12.49 12.49 32.75 0 45.25z">
    </path>
  </svg>
)

const useStyles = makeStyles(theme => ({
  toolbar: {
    justifyContent: 'flex-end'
  }
}))

function Layout(props) {
  const classes = useStyles()
  const { children, history, rehydrateState } = props
  const [anchorEl, setAnchorEl] = React.useState(null)

  const onClick = (evt) => {
    setAnchorEl(evt.currentTarget)
  }

  const onClose = () => {
    setAnchorEl(null)
  }

  const onNavigate = (key) => () => {
    history.push(`/${key}`)
  }

  React.useEffect(() => {
    rehydrateState()
  }, [])

  return (
    <>
      <AppBar position='static'>
        <Toolbar className={classes.toolbar}>
          <IconButton onClick={onNavigate('keys')}>
            <SkeletonKey />
          </IconButton>
          <IconButton onClick={onNavigate('')}>
            <Envelope />
          </IconButton>
          <IconButton onClick={onClick}>
            <MoreVert />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box p={4}>{children}</Box>
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}>
        <MenuItem onClick={onNavigate('')}>Encrypt/Decrypt</MenuItem>
        <MenuItem onClick={onNavigate('keys')}>Key Pairs</MenuItem>
      </Menu>
    </>
  )
}

const mapDispatchToProps = {
  rehydrateState
}

// @ts-ignore
export default flowRight([withRouter, connect(null, mapDispatchToProps)])(
  Layout
)
