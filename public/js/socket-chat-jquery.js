var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');

//referencias de jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatBox = $('#divChatbox');

//Funciones para renderizar usuarios
function renderizarUsuarios(personas) { // [{},{},{}]
    console.log(personas);
    var html = '';
    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';
    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '    <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }
    html += '<li class="p-20"></li>';
    divUsuarios.html(html);
}

function renderizarMensajes(mensaje, reverse) {
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'inverse';
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (!reverse) {
        html += '<li class="animated fadeIn">';
        html += '     <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        html += '     <div class="chat-content">';
        html += '          <h5>' + mensaje.nombre + '</h5>';
        html += '          <div class="box bg-light-info">' + mensaje.mensaje + '</div>';
        html += '     </div>';
        html += '     <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html += '<li class="reverse animated fadeIn">';
        html += '     <div class="chat-content">';
        html += '         <h5>' + mensaje.nombre + '</h5>';
        html += '         <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '     </div>';
        if (mensaje.nombre !== 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        }
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }
    divChatBox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatBox.children('li:last-child');

    // heights
    var clientHeight = divChatBox.prop('clientHeight');
    var scrollTop = divChatBox.prop('scrollTop');
    var scrollHeight = divChatBox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatBox.scrollTop(scrollHeight);
    }
}

//Listeners
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');
    if (id) { console.log(id); }
});

formEnviar.on('submit', function(e) {
    e.preventDefault();
    if (txtMensaje.val().trim().length === 0) {
        txtMensaje.focus();
        return;
    }
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus();
        console.log(mensaje);
        renderizarMensajes(mensaje, false);
        scrollBottom();
    });

});