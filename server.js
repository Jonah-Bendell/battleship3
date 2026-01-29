const express = require('express');
const cors = require('cors');
const app = express();
const PORT =  process.env.PORT||3000;


app.use(cors());
app.use(express.json());
app.use(express.static('public'));


let dataStore = [{player: "Player", pTurn: "Turn", squareState: "Active, Neutral, Hit"}];

const players = {
    "1": null,
    "2": null,
    "3": null
};

const shipsByPlayer = {
    "1": [],
    "2": [],
    "3": []
};

const shipsLocked = {
    "1": false,
    "2": false,
    "3": false
};

let attacks = [];
let currentTurn = "1";

function getPlayerForClient(clientId) {
    return Object.keys(players).find((id) => players[id] === clientId) || null;
}

function getNextPlayer(id) {
    if (id === "1") return "2";
    if (id === "2") return "3";
    return "1";
}

app.get('/api/messages', (req, res) => {
    res.json(dataStore);
});

app.post('/api/messages',(req, res) =>{
    dataStore.push(req.body);
    res.status(201).send({message:"Received!"});
});

app.get('/api/players', (req, res) => {
    res.json({ players });
});

app.post('/api/select', (req, res) => {
    const playerId = String(req.body.playerId || "");
    const clientId = String(req.body.clientId || "");

    if (!["1", "2", "3"].includes(playerId)) {
        res.status(400).json({ ok: false, reason: "invalid_player" });
        return;
    }

    if (!clientId) {
        res.status(400).json({ ok: false, reason: "missing_client" });
        return;
    }

    Object.keys(players).forEach((id) => {
        if (players[id] === clientId && id !== playerId) {
            players[id] = null;
        }
    });

    const current = players[playerId];
    if (current && current !== clientId) {
        res.status(409).json({ ok: false, reason: "taken" });
        return;
    }

    players[playerId] = clientId;
    res.json({ ok: true, playerId });
});

app.get('/api/join', (req, res) => {
    const clientId = String(req.query.clientId || "");
    if (!clientId) {
        res.status(400).json({ success: false, error: "missing_client" });
        return;
    }

    const existing = getPlayerForClient(clientId);
    if (existing) {
        res.json({ success: true, playerId: existing, message: `Rejoined as Player ${existing}` });
        return;
    }

    const openPlayer = Object.keys(players).find((id) => !players[id]);
    if (!openPlayer) {
        res.json({ success: false, error: "All players are taken." });
        return;
    }

    players[openPlayer] = clientId;
    res.json({ success: true, playerId: openPlayer, message: `You are Player ${openPlayer}` });
});

app.get('/api/game-state', (req, res) => {
    res.json({ currentTurn, attacks });
});

app.post('/api/store-ships', (req, res) => {
    const playerId = String(req.body.playerId || "");
    const positions = Array.isArray(req.body.positions) ? req.body.positions : [];

    if (!shipsByPlayer[playerId]) {
        res.status(400).json({ success: false, error: "invalid_player" });
        return;
    }

    shipsByPlayer[playerId] = positions;
    res.json({ success: true });
});

app.post('/api/lock-ships', (req, res) => {
    const playerId = String(req.body.playerId || "");

    if (!shipsLocked.hasOwnProperty(playerId)) {
        res.status(400).json({ success: false, error: "invalid_player" });
        return;
    }

    shipsLocked[playerId] = true;
    res.json({ success: true });
});

app.post('/api/attack', (req, res) => {
    const attackerId = String(req.body.attackerId || "");
    const targetPlayer = String(req.body.targetPlayer || "");
    const row = String(req.body.row || "");
    const col = String(req.body.col || "");

    if (attackerId !== currentTurn) {
        res.json({ success: false, error: "not_your_turn" });
        return;
    }

    if (!shipsByPlayer[targetPlayer]) {
        res.json({ success: false, error: "invalid_target" });
        return;
    }

    const key = `${row},${col}`;
    const isHit = shipsByPlayer[targetPlayer].includes(key);

    attacks.push({ attackerId, targetPlayer, row: Number(row), col: Number(col), isHit });
    currentTurn = getNextPlayer(currentTurn);

    res.json({ success: true, isHit, nextTurn: currentTurn });
});

app.listen(PORT,() => console.log(`Server: http://localhost:${PORT}`));
