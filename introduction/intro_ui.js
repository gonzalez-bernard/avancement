var msg = require("./msg.js")

$("#introduction").html(msg.HTML)

var run = function(event){
    $("#mnu_introduction").removeClass("active")
    $("#introduction").removeClass("show active")
    $("#mnu_equation").addClass("active")
    $("#equation").addClass("show active")
    $("#mnu_equation").removeClass("disabled disabledTab")
    $("#mnu_problem").removeClass("disabled disabledTab")
    init_equation()
}


$("#in_bt_run").on("click",run)