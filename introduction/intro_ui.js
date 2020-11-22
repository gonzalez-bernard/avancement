var msg = require( "./msg.js" )
var init_equation = require( "../equation/equation_ui" ).init_equation

$( "#introduction" ).html( msg.HTML )

var run = function() {
  $( "#mnu_introduction" ).removeClass( "active" )
  $( "#introduction" ).removeClass( "show active" )
  $( "#mnu_equation" ).addClass( "active" )
  $( "#equation" ).addClass( "show active" )
  $( "#mnu_equation" ).removeClass( "disabled disabledTab" )
  $( "#mnu_problem" ).removeClass( "disabled disabledTab" )
  init_equation()
}


$( "#in_bt_run" ).on( "click", run )