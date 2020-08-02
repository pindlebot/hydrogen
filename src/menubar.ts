import { menubar } from 'menubar'
import * as path from 'path'
import { BrowserWindowConstructorOptions } from 'electron'

const isDevMode = process.execPath.match(/[\\/]electron/)

const indexHtml = path.join(process.cwd(), 'dist/index.html')
const browserWindowOptions : BrowserWindowConstructorOptions = {
  useContentSize: true,
  webPreferences: {
    preload: __dirname + '/preload.js'
  }
}
const mb = menubar({
  index: `file://${indexHtml}`,
  preloadWindow: true,
  // @ts-ignore
  // width: isDevMode ? 650 : 400,
  // height: 500,
  width: 800,
  height: 600,
  browserWindow: browserWindowOptions
})

mb.on('ready', function ready() {
  // your app code here
})

mb.on('after-create-window', () => {
  let { webContents } = mb.window

  if (isDevMode) webContents.openDevTools()

  webContents.on('dom-ready', () => {
    webContents.send('init', JSON.stringify({}))
  })
})

export default () => mb
