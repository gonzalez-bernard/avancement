const electron = require( 'electron' );
const {
  app,
  BrowserWindow
} = require( 'electron' );
const url = require( 'url' );
const path = require( 'path' );
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const fs = require( 'fs' );
let win;
const menu_item = new Menu();

// adresse du fichier faisant la liaison entre python et js
const call_py = require( "./modules/call_py.js" );

function createWindow() {

  // Cree la fenetre du navigateur.
  win = new BrowserWindow( {
      width: 1400,
      height: 800,
      resizable: true,
      show: false,
      frame: true,
      title: 'tuto electron',
      webPreferences: {
        nodeIntegration: true,
        webSecurity: true,
        worldSafeExecuteJavaScript: true
      }
    } )
    // et charger le fichier index.html de l'application.

  win.loadURL( url.format( {
    pathname: path.join( __dirname, 'index.html' ),
    protocol: 'file',
    slashes: true
  } ) )

  win.once( 'ready-to-show', () => {
    win.show()
  } )
}

// Chargement des équations
ipcMain.on( 'getEquations', function( event ) {
  call_py.getEquations( event )
} );

// calcul de l'avancement
ipcMain.on( 'calcAvancement', function( event, data ) {
  call_py.calcAvancement( event, data )
} )

// calcul des masses molaires
ipcMain.on( 'calcMassesMolaires', function( event, data ) {
  call_py.calcMassesMolaires( event, data )
} )

// Affiche le graphe
ipcMain.on( 'dspEvolution', function( event, data ) {
  call_py.dspEvolution( event, data )
} )

// Récupère les problèmes
ipcMain.on( 'getProblem', function( event, data ) {
  call_py.getProblem( event, data )
} )

// Connexion 
ipcMain.on( 'id_connexion', function( event, data ) {
  call_py.id_connexion( event, data )
} )

// Inscription 
ipcMain.on( 'id_inscription', function( event, data ) {
  call_py.id_inscription( event, data )
} )

// session
ipcMain.on( 'id_new_session', function( event, data ) {
  call_py.id_new_session( event, data )
} )

// recover
ipcMain.on( 'id_recover', function( event, data ) {
  call_py.id_recover( event, data )
} )

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
        /*
        require('babel-register')({
          presets: ['env']
        });

        module.exports = require('./equation/equation_ui.js')
        module.exports = require('./modules/call_py.js')
        */
    }
  } )
  // Dans ce fichier, vous pouvez inclure le reste de votre code spécifique au processus principal. Vous pouvez également le mettre dans des fichiers séparés et les inclure ici