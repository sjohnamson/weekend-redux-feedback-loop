const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// GET all entries that have been placed
router
    .get('/', (req, res) => {
        // Find all feedback entries and return them
        pool
            .query('SELECT * FROM "feedback";')
            .then((result) => {
                res.send(result.rows);
            }).catch((error) => {
                console.log('Error GET /feedback', error);
                res.sendStatus(500);
            });
    })

// POST a new entry
router
    .post('/', (req, res) => {
        console.log('in router post')

        const {
            feeling,
            understanding,
            support,
            comments,
        } = req.body;
        const sqlText = `INSERT INTO feedback ("feeling", "understanding", "support", "comments")
                        VALUES ($1, $2, $3, $4);`

        pool
            .query(sqlText, [feeling, understanding, support, comments])
            .then(response => {
                res.sendStatus(201);
            })
            .catch(error => {
                console.log('Error POST /feedback', error);
                res.sendStatus(500);
            })
    });

router
    .delete('/:id', (req, res) => {
        console.log('req.params.id in delete: ', req.params.id);
        let entryId = req.params.id;
        let sqlText = `DELETE FROM feedback WHERE id=$1;`

        pool.query(sqlText, [entryId])
            .then((result) => {
                res.sendStatus(200)
            })
            .catch((error) => {
                console.log(`Error making database query ${sqlText}`, error);
                res.sendStatus(500)
            })
    });

module.exports = router;