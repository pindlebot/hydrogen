import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { decrypt, encrypt, generateKeyPair, getKeyMetadata } from './encryption'
import { RequestEvents, ResponseEvents } from './fixtures'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on(RequestEvents.DECRYPT, async (event, args) => {
  const payload = JSON.parse(args)
  const data = await decrypt(payload)
  event.sender.send(ResponseEvents.DECRYPT, JSON.stringify(data))
})

ipcMain.on(RequestEvents.ENCRYPT, async (event, args) => {
  const payload = JSON.parse(args)
  const data = await encrypt(payload)
  event.sender.send(ResponseEvents.ENCRYPT, JSON.stringify(data))
})

ipcMain.on(RequestEvents.GENERATE_KEY_PAIR, async (event, args) => {
  const payload = JSON.parse(args)
  const data = await generateKeyPair(payload)
  event.sender.send(ResponseEvents.GENERATE_KEY_PAIR, JSON.stringify(data))
})

ipcMain.on(RequestEvents.GET_METADATA, async (event, args) => {
  const payload = JSON.parse(args)
  console.log(payload)
  const data = await getKeyMetadata(payload)
  event.sender.send(ResponseEvents.GET_METADATA, JSON.stringify(data))
})