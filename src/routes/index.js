const { Router} = require('express');
const router = Router();



const { getHome } = require('../controllers/index.controllers');
    router.get('/', getHome);

module.exports = router;