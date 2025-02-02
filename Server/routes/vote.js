const express = require('express');
const router = express.Router();
const { verifyUser } = require('../auth-service/middleware/auth');
const { vote } = require('../controllers/vote');

router.post('/vote', verifyUser, vote); // Now it's `/api/polls/vote`

module.exports = router;
