import { createMuiTheme } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    
    primary: {
      light: '#ff7961',
      main: '#A52A2A',
      dark: '#ba000d',
      contrastText: '#000'
    }
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
