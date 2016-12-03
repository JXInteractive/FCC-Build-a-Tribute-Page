$(document).on('ready', function() { $("#accordion").accordion(); });
$('#accordion').accordion({heightStyle: 'content'});
$("#accordion").accordion({ header: "h3", collapsible: true, active: false });