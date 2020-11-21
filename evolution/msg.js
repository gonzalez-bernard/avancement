var cts = require("../constantes.js")
var txt = require ("./lang_" + cts.SUFFIXE_LANG + ".js")

const EV_HTML_TITRE = "<div class='title'><h3>"+txt.EV_TITRE+"</h3></div><br/>"

const EV_HTML_INTRO = "<p>"+txt.EV_INTRO+"</p>"

const EV_HTML_BT_AIDE = "<button id = 'ev_bt_aide' class = 'btn btn-success'>"+txt.EV_BT_AIDE+"</button>"

const EV_HTML_AIDE="<p>"+txt.EV_AIDE_T1+"</p><p>"+txt.EV_AIDE_T2+"</p><p>"+txt.EV_AIDE_T3+"</p><p>"+txt.EV_AIDE_T4+"</p>"

const EV_GET_HTML = function(equation){
  HTML = EV_HTML_TITRE + "<div = 'container-fluid'><div class='row'>"+
  "<div class='col-9' id= 'ev_equation'>" + EV_HTML_INTRO + "<h4>" + equation + "</h4></div>" +
  "<div class='col'>"+EV_HTML_BT_AIDE+"</div></div>" +
  "<div class='row'>" +
  "<div class='col-9' id='ev_myplot'></div>" + cts.FOOTER +
  "<div class='col' style='display:none' id='ev_info'>" + EV_HTML_AIDE+"</div></div>"  

  return HTML
} 

module.exports = {EV_GET_HTML}
