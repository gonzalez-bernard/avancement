const ipc = require( 'electron' ).ipcRenderer

ipc.on("test2_ok", function( event, data ){
  console.log('retour referer2')
  console.log(data)
})

console.log('Envoi')
ipc.send("test2",[7,[4,{"f":"return_json"}],{"x":"3"}])

