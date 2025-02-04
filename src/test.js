import fastify from 'fastify';
import { getData } from './api.js';

const app = fastify();
const PORT = 3000;

app.register(require('@fastify/view'), {
    engine: {
        handlebars: require('handlebars'),
    },
});

app.get('/', async (req, reply) => {
    try {
        const characters = await getData('https://gateway.marvel.com/v1/public/characters', PUBLIC_KEY, PRIVATE_KEY);
        reply.view('/templates/index.hbs', { characters });
    } catch (error) {
        console.error(error);
        reply.send('Erreur lors de la récupération des données.');
    }
});

app.listen({ port: PORT, host: '0.0.0.0' }, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
