const express = require('express');
const bodyParser = require('body-parser'); // Middleware qui traite les requêtes HTTP
const db = require('./db');
const app = express();
const port = 3004;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

// Route pour afficher toutes les tâches
app.get('/', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des tâches:', err);
            return res.sendStatus(500);
        }
        res.render('index', { tasks: results });
    });
});


// Route pour afficher la page d'ajout
app.get('/add', (req, res) => {
    res.render('add'); // Assurez-vous d'avoir un fichier add.ejs
});

// Route pour ajouter et poster une nouvelle tâche
app.post('/add', (req, res) => {
    const { task } = req.body; // Obtenir la tâche à partir du corps de la requête
    db.query('INSERT INTO tasks(description) VALUES (?)', [task], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de la tâche:', err);
            return res.sendStatus(500);
        }
        res.redirect('/');
    });
});

// Route pour afficher la page d'édition
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM tasks WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de la tâche:', err);
            return res.sendStatus(500);
        }
        res.render('edit', { task: results[0] }); // Passez la tâche à la page d'édition
    });
});

// Route pour modifier une tâche (id pour savoir laquelle)
app.post('/edit/:id', (req, res) => {
    const { id } = req.params; // Obtenir l'id de la tâche à partir des paramètres de l'URL
    const { newTask } = req.body; // Obtenir la nouvelle tâche à partir du corps de la requête
    db.query('UPDATE tasks SET description = ? WHERE id = ?', [newTask, id], (err, result) => {
        if (err) {
            console.error('Il y a une erreur lors de la modification de la tâche:', err);
            return res.sendStatus(500);
        }
        res.redirect('/');
    });
});

// Route pour supprimer une tâche
app.post('/delete/:id', (req, res) => {
    const { id } = req.params; // Obtenir l'id de la tâche à supprimer
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression:', err);
            return res.sendStatus(500);
        }
        res.redirect('/');
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
