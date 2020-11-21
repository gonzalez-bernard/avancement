const ipc = require( 'electron' ).ipcRenderer


ipc.on("test1_ok", function( event, data ){
  console.log('retour referer1')
  console.log(data)
})

//ipc.send("test1")