const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt")
// Import the log model
const { LogModel } = require('../models');

router.get('/practice', validateJWT, (req, res) => {
    res.send('Hey!! This is a practice route!')
});

// Log creation
router.post('/create', validateJWT, async (req, res) => {
    const { title, date, entry } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        title,
        date,
        entry,
        owner: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    LogModel.create(logEntry)

});

// Get all logs
router.get("/", async (req, res) => {
    try {
        const entries = await LogModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Get logs by User
router.get("/mine", validateJWT, async (req, res) => {
    let { id } = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Get logs by title
router.get("/:title", async (req, res) => {
    const { title } = req.params;
    try {
        const results = await LogModel.findAll({
            where: { title: title }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Update a log
router.put("/update/:entryId", validateJWT, async (req, res) => {
    const { title, date, entry } = req.body.log;
    const logId = req.params.entryId;
    const userId = req.user.id;

    const query = {
        where: {
            id: logId,
            owner: userId
        }
    };

    const updatedLog = {
        title: title,
        date: date,
        entry: entry
    };

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update)
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Delete a log
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
                owner: ownerId
            }
        };

        await LogModel.destroy(query);
        res.status(200).json({ message: "Log Entry Removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/about', (req, res) => {
    res.send('Hey!! This is an about route!')
});

module.exports = router;