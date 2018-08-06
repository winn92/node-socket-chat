const { io } = require('../server');
const { Usuarios } = require('./../classes/usuarios');
const { crearMensaje } = require('./../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {
    client.on('entrarChat', (usuario, callback) => {
        const { nombre, sala } = usuario;
        if (!nombre || !sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y la sala son necesarios'
            });
        }

        client.join(sala);

        usuarios.agregarPersona(client.id, nombre, sala);
        const usuarioPorSala = usuarios.getPersonasPorSala(sala);
        client.broadcast.to(sala).emit('listaPersona', usuarioPorSala);
        callback(usuarioPorSala);

    });

    client.on('crearMensaje', (data) => {
        const { nombre, sala } = usuarios.getPersona(client.id);
        const mensaje = crearMensaje(nombre, data.mensaje);
        client.broadcast.to(sala).emit('crearMensaje', mensaje);
    });

    client.on('disconnect', () => {
        const { sala, nombre } = usuarios.borrarPersona(client.id);
        client.broadcast.to(sala).emit('crearMensaje', crearMensaje('Administrador', `${ nombre} salió.`));
        client.broadcast.to(sala).emit('listaPersona', usuarios.getPersonasPorSala(sala));
    });

    //Mensajes privados
    client.on('mensajePrivado', data => {
        const persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });
});