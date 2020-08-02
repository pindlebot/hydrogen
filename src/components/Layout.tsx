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

const useStyles = makeStyles(theme => ({
  toolbar: {
    justifyContent: 'flex-end'
  },
  header: {
    backgroundImage: 'linear-gradient(to top, #4481eb 0%, #04befe 100%)'
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
      <AppBar position='static' className={classes.header}>
        <Toolbar className={classes.toolbar}>
          <IconButton onClick={onClick}>
            <MoreVert />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box p={4}>{children}</Box>
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}>
        <MenuItem onClick={onNavigate('message')}>Encrypt/Decrypt</MenuItem>
        <MenuItem onClick={onNavigate('')}>Key Pairs</MenuItem>
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
