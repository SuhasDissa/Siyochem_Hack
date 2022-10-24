// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, session, systemPreferences, dialog } = require('electron')
const path = require('path')
const psList = require('ps-list');
const fetch = require('node-fetch');
var crypto = require('crypto');
const { autoUpdater } = require("electron-updater")
const si = require('systeminformation');

var date = new Date().toLocaleString("en-GB", {timeZone: "Asia/Colombo"}).slice(0, 10)
const rand = Math.floor(Math.random() * 1000)
const hash = crypto.createHash('md5').update(date+(rand*1027)).digest("hex");

Menu.setApplicationMenu(null)
let mainWindow
let loadingScreen;
let CONFIGURATION = {
                    "version": 2,
                    "block_apps": [
                      "QuickTime Player"
                    ],
                    "screens_allowed": 1,
                    "ask_permission": false
                  };

const SITE_URL = "https://siyochem.com";
const SITE_NAME = "Siyochem"

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    title: SITE_NAME,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  autoUpdater.checkForUpdatesAndNotify();

  const cookie = { url: SITE_URL, name: 'SB_SECURE_VIEW_TOKEN_APP',
                   value: 'GENERALSECUREXXCAXXZCN13i3jerdasjjdna_'+CONFIGURATION.version+"_"+hash+"_"+rand}
  // console.log(cookie)
  session.defaultSession.cookies.set(cookie)
  .then(() => {
      console.log("Loading Completed")
  }, (error) => {
      console.error(error)
  });

  const cookie_auth_2 = {
                      url: SITE_URL, 
                      name: 'SB_APP_DESKTOP', 
                      value: "true"
                    }
  session.defaultSession.cookies.set(cookie_auth_2)
  .then(() => {
      console.log("Loading Auth 2 Completed")
  }, (error) => {
      console.error(error)
  });

  const cookie_auth = {
    url: SITE_URL, 
    name: 'SB_APP_AUTH', 
    value: 'IOS_ADSDXXCAXXZCN13i3jerdasjjdna_'+
              SITE_URL+'_DESKTOP_' 
              + CONFIGURATION.version +
              "_"+ hash+"_"+rand
  }
session.defaultSession.cookies.set(cookie_auth)
.then(() => {
console.log("Loading Auth Completed")
}, (error) => {
console.error(error)
});

  mainWindow.maximize()

  mainWindow.loadURL(SITE_URL)

  mainWindow.webContents.on('did-finish-load', () => {
    if (loadingScreen) {
      loadingScreen.close();
    }
    mainWindow.show();
  });
}

const createLoadingScreen = () => {
  loadingScreen =
    new BrowserWindow({
      width: 512,
      title: SITE_NAME,
      height: 512,
      frame: false,
      transparent: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  loadingScreen.setResizable(false);
  loadingScreen.loadFile('loading.html');
  loadingScreen.on('closed', () => (loadingScreen = null));
  loadingScreen.webContents.on('did-finish-load', () => {
    loadingScreen.show();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createLoadingScreen();
  /// add a little bit of delay for tutorial purposes, remove when not needed
  setTimeout(() => {
    createWindow();
  }, 3000);

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
