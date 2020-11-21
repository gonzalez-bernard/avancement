var cts = require("../constantes.js")
var msg = require("./msg.js")
var msg_eq = require("./../equation/msg.js")
var msg_av = require("./../tab_avancement/msg.js")
var utils = require("../modules/utils.js")
let txt_eq = require("./../equation/lang_" + cts.SUFFIXE_LANG + ".js")
let txt_av = require("./../tab_avancement/lang_" + cts.SUFFIXE_LANG + ".js")

function init_help(){

    // Affiche page
    $("#aide").html(msg.AI_HTML_PAGE)

    $( "#ai_link_eq_principe" ).on( 'click', function(){
        $("#ai_info").html(msg_eq.EQ_HTML_PRINCIPE)
        $("#eq_equilibrage1").on('click',null,{titre: txt_eq.EQ_EQUILIBRAGE, info: txt_eq.EQ_EQUILIBRAGE_TEXT1,
            container: '#ai_exemples', btclose: txt_eq.EQ_BT_EQUILIBRAGE_CLOSE},utils.dsp_modal_info)
        $("#eq_equilibrage2").on('click',null,{titre: txt_eq.EQ_EQUILIBRAGE, info: txt_eq.EQ_EQUILIBRAGE_TEXT2,
            container: '#ai_exemples', btclose: txt_eq.EQ_BT_EQUILIBRAGE_CLOSE},utils.dsp_modal_info)
    })

    // Gestion des liens
    $( "#ai_link_eq_methode" ).on( 'click', function(){
        $("#ai_info").html(msg_eq.EQ_HTML_METHODE)
        $("#eq_equilibrage1").on('click',null,{titre: txt_eq.EQ_EQUILIBRAGE, info: txt_eq.EQ_EQUILIBRAGE_TEXT1,
            container: '#ai_exemples', btclose: txt_eq.EQ_BT_EQUILIBRAGE_CLOSE},utils.dsp_modal_info)
        $("#eq_equilibrage2").on('click',null,{titre: txt_eq.EQ_EQUILIBRAGE, info: txt_eq.EQ_EQUILIBRAGE_TEXT2,
            container: '#ai_exemples', btclose: txt_eq.EQ_BT_EQUILIBRAGE_CLOSE},utils.dsp_modal_info)    
    })

    $('#ai_link_avancement').on('click',function(){
        $("#ai_info").html(msg_av.TB_HTML_INFO)
        $("#tb_tab_avancement_help1").on('click',null,{titre: txt_av.TB_LIMITANT, info: msg_av.TB_LIMITANT_TEXT1,
            container: '#ai_exemples', btclose: txt_av.TB_BT_LIMITANT_CLOSE, math: true},utils.dsp_modal_info)
        $("#tb_tab_avancement_help2").on('click',null,{titre: txt_av.TB_LIMITANT, info: msg_av.TB_LIMITANT_TEXT2,
            container: '#ai_exemples', btclose: txt_av.TB_BT_LIMITANT_CLOSE, math: true},utils.dsp_modal_info)
        })
}

init_help()