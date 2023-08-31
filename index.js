const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});
 
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Conexion exitosa.');
});

const numeroCliente = message.from; // El nC:mero del cliente
const estadosFinalizados = {}; // Objeto para almacenar el estado finalizado por cliente

// Si el cliente estC! marcado como finalizado, no se le responde mC!s
if (estadosFinalizados[numeroCliente]) {
    return;
}

client.on('message', async (msg) => {
    if (msg.body.toLowerCase() === 'hi' || msg.body.toLowerCase() === 'hello') {
        await msg.reply('Welcome to the chatbot! Please choose an option: "rates", "info", or "agent".');
    } else if (msg.body.toLowerCase() === 'rates') {
        await msg.reply('Please enter a number between 1 and 6 for rates:');
    } else if (msg.body.toLowerCase() === 'info') {
        await msg.reply('Here is some information...');
    } else if (msg.body.toLowerCase() === 'agent') {
        await msg.reply('Connecting you to an agent. Your query will be answered shortly.');
        // Mark conversation as answered and stop further interaction
        // (You would need to implement this functionality)
    } else if (!isNaN(msg.body) && parseInt(msg.body) >= 1 && parseInt(msg.body) <= 6) {
        const rateNumber = parseInt(msg.body);
        const rateMessages = [
            'Rate 1: ...',
            'Rate 2: ...',
            'Rate 3: ...',
            'Rate 4: ...',
            'Rate 5: ...',
            'Rate 6: ...'
        ];
        await msg.reply(rateMessages[rateNumber - 1]);
    } else {
        await msg.reply(`I'm sorry, I didn't understand that. Please choose "rates", "info", or "agent".`);
    }
});

client.initialize();
