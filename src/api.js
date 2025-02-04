import fetch from 'node-fetch';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Calcul la valeur md5 dans l'ordre : timestamp + privateKey + publicKey
 * @param {string} publicKey - Clé publique
 * @param {string} privateKey - Clé privée
 * @param {string} timestamp - Timestamp actuel
 * @returns {string} - Hash MD5
 */
export const getHash = (publicKey, privateKey, timestamp) => {
    const hash = crypto.createHash('md5');
    hash.update(timestamp + privateKey + publicKey);
    return hash.digest('hex');
};

/**
 * Récupère les données de l'API Marvel
 * @param {string} url - URL de l'API
 * @returns {Promise<Array>} - Tableau des personnages avec image valide
 */
export const getData = async (url) => {
    const timestamp = Date.now().toString();
    const publicKey = process.env.PUBLIC_KEY;
    const privateKey = process.env.PRIVATE_KEY;
    const hash = getHash(publicKey, privateKey, timestamp);

    const fullUrl = `${url}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;
    const response = await fetch(fullUrl);

    if (!response.ok) {
        throw new Error(`Erreur API : ${response.status}`);
    }

    const data = await response.json();
    return data.data.results
        .filter(character => !character.thumbnail.path.includes('image_not_available'))
        .map(character => ({
            name: character.name,
            description: character.description || 'Description indisponible',
            imageUrl: `${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}`
        }));
};
