import { createMuiTheme } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    
    primary: blue
  },
  typography: {
    fontSize: 11,
    fontFamily: [
      'SFMono-Regular',
      'Consolas',
      'Liberation Mono',
      'Menlo,monospace'
    ].join(',')
  },
  overrides: {
    'MuiCssBaseline': {
      // @ts-ignore
      '@global': {
        body: {
          margin: 0,
          padding: 0,
          color: '#24292e'
        }
      }
    }
  }
})

export default theme
