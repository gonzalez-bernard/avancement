const electron = require( 'electron' );
const {
  app,
  BrowserWindow
} = require( 'electron' );
const url = require( 'url' );
const path = require( 'path' );
const ipcMain = electron.ipcMain;
const fs = require( 'fs' );
let win;

// adresse du fichier faisant la liaison entre python et js
const call_py = require( "./tests/call_py.js" )

function createWindow() {

  // Cree la fenetre du navigateur.
  win = new BrowserWindow( {
      width: 800,
      height: 600,
      resizable: true,
      show: false,
      frame: true,
      title: 'tuto electron',
      webPreferences: {
        nodeIntegration: true
      }
    } )
    // et charger le fichier index.html de l'application.

  win.loadURL( url.format( {
    pathname: path.join( __dirname, 'test_index.html' ),
    protocol: 'file',
    slashes: true
  } ) )

  win.once( 'ready-to-show', () => {
    win.show()
  } )
}

// Chargement des équations
ipcMain.on( 'test1', function( event ) {
  call_py.test1( event )
} );


ipcMain.on('test2', function(event, data) {
    call_py.test2(event,data)
})

ipcMain.on('test_bokeh', function(event, data) {
    call_py.test_bokeh(event,data)
})

ipcMain.on('test_getProblems', function(event, data) {
    call_py.test_getProblems(event,data)
})




// Cette méthode sera appelée quant Electron aura fini
// de s'initialiser et prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quand cet événement est émit.
app.whenReady().then( createWindow )

// Quitter si toutes les fenêtres ont été fermées.
app.on( 'window-all-closed', () => {
  // Sur macOS, il est commun pour une application et leur barre de menu
  // de rester active tant que l'utilisateur ne quitte pas explicitement avec Cmd + Q
  if ( process.platform !== 'darwin' ) {
    app.quit()
  }
} )

app.on( 'activate', () => {
    // Sur macOS, il est commun de re-créer une fenêtre de l'application quand
    // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres d'ouvertes.
    if ( win === null ) {
      createWindow()
    }
  } )
  // Dans ce fichier, vous pouvez inclure le reste de votre code spécifique au processus principal. Vous pouvez également le mettre dans des fichiers séparés et les inclure ici