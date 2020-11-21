var cts = require("../constantes.js")
var txt = require ("./lang_" + cts.SUFFIXE_LANG + ".js")

AV_HTML_INTRO = "<div class='title'><h3>" + txt.AV_TITRE + "</h3></div><br/>" + "<p>"+txt.AV_INTRO+"</p>"

AV_HTML_INFO = "<br/><p>" + txt.AV_INFO + "</p>"

AV_HTML_UNITE = "<fieldset class='unite-border'><legend class='unite-border'>"+txt.AV_UNITE_TITRE+"</legend>" +
    "<label class='radio-inline'><input type='radio'  name='choice_unites' value=1 checked>"+txt.AV_UNITE_LABEL_MOL+"</label>" +
    "<label class='radio-inline'><input type='radio' name='choice_unites' value=2>"+txt.AV_UNITE_LABEL_G+"</label></fieldset>"

AV_INIT_TAB_REACTIF = function(equation, indice){
    let html = "<tr><td>" + equation.reactifs[indice][0]+"</td>"
    html += "<td><input name='mol' id='av_reac"+ indice + "' type='text' class = 'form-control form-quantite' "
    html += "required pattern = '[0-9.]{1,4}' ></td>"
    html += "<td><input name='gramme' id='av_reacg"+ indice + "' type='text' class = 'form-control form-quantite' "
    html += "required pattern = '[0-9.]{1,4}' disabled ></td>"
    html += "<td id='qr"+indice+"'<td><td id='qrg"+indice+"'<td></tr>"
    return html
}

AV_INIT_TAB_PRODUIT = function(equation, indice){
    let html ="<tr><td>" + equation.produits[indice][0]+"</td>"
    html += "<td><input name='mol' id='av_prod"+ indice + "' type='text' class = 'form-control form-quantite' "
    html += "value = 0 required pattern = '[0-9.]{1,4}' ></td>"
    html += "<td><input name='gramme' id='av_prodg"+ indice + "' value = 0 type='text' class = 'form-control form-quantite' "
    html +="required pattern = '[0-9.]{1,4}' disabled ></td>"
    html += "<td id='qp"+indice+"'<td><td id='qpg"+indice+"'<td></tr>"
    return html
}

AV_HTML_TITRE = "<th>"+txt.AV_TITRE_ESPECE+"</th><th>"+txt.AV_QUANTITE_MOL+"</th><th>"+txt.AV_QUANTITE_G+"</th>"+
"<th>"+txt.AV_QUANTITE_REST_MOL+"</th><th>"+txt.AV_QUANTITE_REST_G+"</th></tr></thead><tbody>"

AV_HTML_BUTTONS = "<hr/><button id='av_bt_quantite' type = 'button' class = 'btn btn-success'  >"+txt.AV_BT_VALID+"</button>" +
"<button id='av_bt_tab_avancement' type = 'button' class = 'btn btn-info'  >"+txt.AV_BT_TAB+"</button>"

module.exports = {AV_HTML_TITRE,AV_HTML_BUTTONS, AV_HTML_INTRO, AV_HTML_INFO, AV_HTML_UNITE,
    AV_INIT_TAB_REACTIF, AV_INIT_TAB_PRODUIT}
