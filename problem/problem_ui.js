/**
PRINCIPE
  Le programme choisit une question au hasard.
  Chaque question contient plusieurs variables qui peuvent être l'équation, les quantités de matière ou les masses.
  L'équation est piochée dans la base.
  A partir de la question, on extrait les variables à générer (quantités ou masses) et les données à chercher.
  Légende : 
  - équation : #eqn, n étant l'indice de l'équation  
  - réactifs : #r0, #r1, ...,
  - produits : #p0, #p1,...,
  - les quantités de matière sont préfixés par n : #nr0..., #np0...
  - les masses sont préfixées par m : #mr0..., #mp0...
  - les volumes sont préfixés par v : #vr0..., #vp0...
  - les coefficients obtenus grâce à l'équation : #cr0..., #cp0...
  - réponse à fournir #X

  Le format est de xml
  <problems>
    <problem>
      <id>1</id>
      <level>1</level>
      <context>.....</context>
      <question>....</question>
      <response>....</response>
      <feedback>....</feedback>
      <calcul>....</calcul>
    </problem>

  Les calculs s'effectuent grâce aux formules fournies dans la partie calcul 
  ex : #X=#nr0*#cr1/#cr0

FONCTIONS

  - get_problems : lit le fichier et enregistre les problémes
  - get_problem : extrait un problème
  - get_equation : extrait l'équation à partir de la lecture du problème
  - get_data : définit les variables de façon aléatoire
  - calcData : effectue les calculs définis dans l'item calcul
  - dspProblem : affiche le contexte et la question
  - dspResponse : affiche la saisie
  - verifResponse : vérifie la réponse
  - dspFeedback : affiche le feedback 

**/

const ipc = require( 'electron' ).ipcRenderer
const msg = require("./msg.js")
var cts = require("../constantes.js")
var txt = require ("./lang_" + cts.SUFFIXE_LANG + ".js")
const utils = require( "./../modules/utils.js" )
var valeur  // valeur de retour à chercher
var n_essais = 0  // nombre d'essais
var nb_essais = 0
var feedback
var help
var solution
var xmax

init_problem = function(){

  // Lance le process de récupération des problèmes
  var get_problem = function(event){
    // efface le conteneur
    $("#pb_solution").html('')
    $("#pb_help").html('')

    if (event.data)
      ipc.send("getProblem", event.data.indice)
    else
      ipc.send("getProblem")
  }

  // Vérifie la saisie
  var valid_problem = function(){
    // On arrondit la valeur en tenant compte du nombre de CS (precision)
    valeur_arrondi = utils.math_arrondir(valeur, precision)
    //valeur_arrondi = parseFloat(valeur.toFixed(2))
    reponse = parseFloat($("#pb_problem_response").val()).toFixed(2)
    let r = Math.abs(reponse-valeur_arrondi)
    if (r < valeur/100) {
      dsp_message(true)
    } else if (r < valeur/10)
      dsp_message(false,1)
    else {
        n_essais++  // incrémente le nombre d'essais
        if (n_essais == nb_essais){
          $("#pb_bt_result_problem").attr('disabled',false)
        }
      dsp_message(false, 2)
    }
  }

  // Affiche les messages en cas de succés ou d'erreur
  var dsp_message = function(result, mode=0){
    var id
    
    if (result){
      id = "#pb_alert_success"
      let msg = feedback[0]['#text']
      $("#pb_success").html(msg)
    } else {
      id = "#pb_alert_error"
      let msg = feedback[mode]['#text']
      $("#pb_error").html(msg)
    }

    $(id).show().alert()
  }

  // Affiche la solution ou l'aide
  var dsp_info = function(event){

    // Efface contenu précédent
    if (event.data['target'] == "#pb_help"){
      $("#pb_solution").html('')
    } else {
      $("#pb_help").html('')
    }

    html = event.data['html']+"<hr/>"
    utils.dsp_html_latex(html,event.data['target'])
  }

  var zoom_in = function(event){
    img = event.currentTarget.children[0]
    if (img.src.indexOf('zoom-in') == -1){
      img.src = 'resources/img/zoom-in.png'
      $("#pb_img").css("transform","scale(1)")
      //$('#pb_img').toggle({ effect: "scale", percent: 100 })
      //$('#pb_img').animate({'zoom':1},400)
      $('#pb_enonce').animate({ 'zoom': 1 }, 400)
    } else {
      img.src = 'resources/img/zoom-out.png'
      //$('#pb_img').animate({'zoom':0.2},400)
      $("#pb_img").css("transform","scale(0.5)")
      //$('#pb_img').toggle({ effect: "scale", percent: 50 })
      $('#pb_enonce').animate({ 'zoom': 2 }, 100)
    }
  }

  var zoom_img_on = function (event){
    $("#pb_img").css("transform","scale(1.5)")
  }

  var zoom_img_out = function (event){
    $("#pb_img").css("transform","scale(1)")
  }
    
  // Enregistre les problèmes dans session
  ipc.on("getProblem_ok", function( event, data ){

    // Remplace les informations de formatage entre crochets [...] par <...>
    for (key in data){
      if (typeof data[key] == 'string'){
        data[key] = data[key].replaceAll('[', '<')
        data[key] = data[key].replaceAll(']', '>')
      }
    }
    html = msg.PB_ENONCE(data['id'],data['context'],data['question'],data['img'] )
    $("#pb_enonce").html(html)

    html = msg.PB_REPONSE(data['unite'])
    $("#pb_reponse").html(html)

    $("#pb_container_buttons_problem").show()
    valeur = data['valeur']

    sessionStorage.setItem('problem',JSON.stringify(data))
    feedback = data['feedback']
    help = data['help']
    solution = data['solution']
    nb_essais = feedback.length-1
    precision = data['precision']
    xmax = data['xmax']
    lim = data['lim']

    $('#pb_bt_help').on('click',{html: help, target: '#pb_help'}, dsp_info)
    $('#pb_bt_solution').on('click',{html: solution, target: '#pb_solution'}, dsp_info)
    $('#pb_zoom').on('click',zoom_in)
    $("#pb_img").hover(zoom_img_on, zoom_img_out)

    $("#pb_problem_response:input").on( 'input', {
      feedback: '#pb_problem_feedback',
      button: '#pb_bt_valid'
    }, utils.form_valid_btn );

  })

  html = msg.PB_INIT()

  $("#problem").html(html)

  $('#pb_bt_qetSimple').on('click', get_problem)
  $('#pb_bt_qetNormal').on('click',{indice:2}, get_problem)
  $('#pb_bt_qetDifficult').on('click',{indice:3}, get_problem)
  $('#pb_bt_valid').on('click',valid_problem)
  
 
}

