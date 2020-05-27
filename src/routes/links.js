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
    req.flash('success', 'The Link whas saved!');
    res.redirect('/links');
});

router.get('/delete/:id', async(req, res) => {
    //console.log(req.params.id);
    const {id} = req.params;
    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    req.flash('success', 'The Link whas deleted');
    res.redirect('/links');
});

router.get('/edit/:id', async(req, res) => {
    //console.log(req.params.id);
    const {id} = req.params;
    const link = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    //console.log(link);
    res.render('links/edit', {
        link: link[0]
    });
});

router.post('/edit', async(req, res) => {
    await pool.query('UPDATE links SET title = ?, url = ?, description = ? WHERE id = ?', [req.body.title, req.body.url, req.body.description, req.body.id]);
    req.flash('success', 'The Link whas edited');
    res.redirect('/links');
});

module.exports = router;