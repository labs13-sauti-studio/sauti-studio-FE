import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/core/Menu'
import React from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'gatsby'

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

const Navbar = () => {
  console.log(process.env.GATSBY_API_URL)
  const classes = useStyles()
  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          aria-label="Menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          <Link to="/">Sauti Studio</Link>
        </Typography>
        <a href={`${process.env.GATSBY_API_URL}/auth/google`}>
          <Button color="primary">Login</Button>
        </a>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
