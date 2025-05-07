const axios = require('axios');

async function getAuthenticatedUser(token) {
    try {
        const response = await axios.get('http://localhost:8082/auth/me', {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Erreur HTTP retournée par le service Java
            console.error('Erreur:', error.response.status, error.response.data);
        } else {
            // Erreur réseau ou autre
            console.error('Erreur de requête:', error.message);
        }
        return null;
    }
}

async function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token is required' });

    const user = await getAuthenticatedUser(token);
    if (!user) return res.status(401).json({ message: 'Invalid token' });

    req.user = user;
    next();
}

module.exports ={
    authMiddleware
    ,
}
