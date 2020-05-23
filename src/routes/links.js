const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
    const links = await pool.query('SELECT * FROM links');
    res.render('links/list', {
        links: links
    });
});

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async(req, res) => {
    // podríamos usar directamente req.body pero en este caso creamos un nuevo objeto newLink para contener los datos
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    }

    await pool.query('INSERT INTO links SET ?', [newLink]);

    res.redirect('/links');
});

module.exports = router;