class Usuarios {
    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        const persona = { id, nombre, sala };
        this.personas.push(persona);
        return this.personas
    }

    getPersona(id) {
        const persona = this.personas.filter(p => p.id === id)[0];
        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        const personasEnSala = this.personas.filter(p => p.sala === sala);
        return personasEnSala;
    }

    borrarPersona(id) {
        const personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(p => p.id !== id);
        return personaBorrada;
    }
}

module.exports = {
    Usuarios
}