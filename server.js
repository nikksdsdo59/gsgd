const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('.')); // Sert les fichiers HTML/CSS

// Base de données en mémoire
let users = {}; 

// --- ROUTE D'INSCRIPTION (Celle qui manquait) ---
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    
    if (!users[username]) {
        // Génère une clé unique style VAN-USER-xyz...
        const key = 'VAN-' + username.toUpperCase() + '-' + Math.random().toString(36).substr(2, 8);
        
        users[username] = { 
            password: password, 
            key: key 
        };
        
        console.log(`Nouveau compte créé : ${username} | Clé : ${key}`);
        res.json({ status: 'ok', key: key });
    } else {
        res.status(409).json({ status: 'error', message: 'Utilisateur déjà existant' });
    }
});

// --- ROUTE DE CONNEXION ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (users[username] && users[username].password === password) {
        res.json({ 
            status: 'ok', 
            key: users[username].key,
            user: username
        });
    } else {
        res.status(401).json({ status: 'error' });
    }
});

// --- ROUTE DE VÉRIFICATION (Pour le cheat) ---
app.post('/api/check', (req, res) => {
    const { key } = req.body;
    
    for (let i in users) {
        if (users[i].key === key) {
            return res.json({ status: 'valid', user: i });
        }
    }
    res.json({ status: 'invalid' });
});

// Lancement du serveur
app.listen(3000, () => {
    console.log(`Serveur Vaniaty prêt sur http://localhost:3000`);
});