const qrcode = require('qrcode-terminal');

//Crea una sesión con whatsapp-web y la guarda localmente para autenticarse solo una vez por QR
const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth()
});

//Genera el código qr para conectarse a whatsapp-web
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

//Si la conexión es exitosa muestra el mensaje de conexión exitosa
client.on('ready', () => {
    console.log('Conexion exitosa.');
});

// Objeto para almacenar el estado finalizado por cliente
const estadosFinalizados = {};


client.on('message', message => {
    console.log(`Recibido desde ${message.from} mensaje: ${message.body}`);

    const numeroCliente = message.from; // El número del cliente

/*     // Si el mensaje proviene de nosotros, marcamos la conversación como finalizada
    if (message.from === '542901632079') {
        estadosFinalizados[numeroCliente] = { finalizado: true };
        return;
    } */

    // Si el cliente está marcado como finalizado, no se le responde más
    if (estadosFinalizados[numeroCliente]) {
        return;
    }

    const respuesta = 'Hola, gracias por comunicarte con X,\nPara consulta de tarifas escribe *TARIFAS*\n\nSi ya tienes una reserva y deseas información, escribe *CONSULTAS*\nSi deseas hablar con un agente, escribe *AGENTE*';

    if (message.body === 'TARIFAS') {
        if (!estadosFinalizados[numeroCliente]) {
            estadosFinalizados[numeroCliente] = { seleccionandoTarifa: true };
            const respuestaTarifas = 'Elige una opcción:\n1. Tarifario A\n2. Tarifario D';
            client.sendMessage(message.from, respuestaTarifas);
        }
    } else if (message.body === 'CONSULTAS') {
        const respuestaConsultas = 'Puedes consultar tus dudas sobre reservas aquí...';
        client.sendMessage(message.from, respuestaConsultas);
    } else if (message.body === 'AGENTE') {
        const respuestaAgente = 'Estoy transfiriendo tu solicitud a un agente...';
        client.sendMessage(message.from, respuestaAgente);
    } else if (message.body === '1') {
        if (estadosFinalizados[numeroCliente] && estadosFinalizados[numeroCliente].seleccionandoTarifa) {
            estadosFinalizados[numeroCliente].seleccionandoTarifa = false;
            const tarifarioA = 'Aquí tienes la información del Tarifario A...';
            client.sendMessage(message.from, tarifarioA);
        }
    } else if (message.body === '2') {
        if (estadosFinalizados[numeroCliente] && estadosFinalizados[numeroCliente].seleccionandoTarifa) {
            estadosFinalizados[numeroCliente].seleccionandoTarifa = false;
            const tarifarioB = 'Aquí tienes la información del Tarifario B...';
            client.sendMessage(message.from, tarifarioB);
        }
    } else if (message.body === 'FIN') {
        estadosFinalizados[numeroCliente] = { finalizado: true }; // Marcar como finalizado para este cliente
        const respuestaFin = 'Has finalizado la interacción. No recibirás más respuestas.';
        client.sendMessage(message.from, respuestaFin);
    } else {
        client.sendMessage(message.from, respuesta);
    }
});



client.initialize();