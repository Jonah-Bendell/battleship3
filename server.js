const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store player assignments: { clientId: playerId }
let clientToPlayer = {};

// Store ship lock status: { playerId: boolean }
let shipsLocked = {
    "1": false,
    "2": false,
    "3": false
};

// Get or assign player based on clientId
app.get('/api/join', (req, res) => {
    const clientId = req.query.clientId;
    
    if (!clientId) {
        return res.status(400).json({ error: "Missing clientId" });
    }

    // Check if this client already has a player
    if (clientToPlayer[clientId]) {
        const playerId = clientToPlayer[clientId];
        console.log(`Client ${clientId} already has player ${playerId}`);
        return res.json({ 
            success: true, 
            playerId, 
            locked: true,
            message: "You are already assigned to a player" 
        });
    }

    // Find first available player
    const takenPlayers = new Set(Object.values(clientToPlayer));
    let assignedPlayer = null;

    for (let i = 1; i <= 3; i++) {
        if (!takenPlayers.has(String(i))) {
            assignedPlayer = String(i);
            break;
        }
    }

    if (!assignedPlayer) {
        return res.status(409).json({ 
            error: "All players are taken",
            success: false 
        });
    }

    // Assign player to client
    clientToPlayer[clientId] = assignedPlayer;
    console.log(`Assigned player ${assignedPlayer} to client ${clientId}`);
    console.log('Current assignments:', clientToPlayer);

    res.json({ 
        success: true, 
        playerId: assignedPlayer,
        locked: true,
        message: `You are Player ${assignedPlayer}` 
    });
});

// Get current game state
app.get('/api/players', (req, res) => {
    const players = {
        "1": null,
        "2": null,
        "3": null
    };

    // Fill in which clients have which players
    Object.entries(clientToPlayer).forEach(([clientId, playerId]) => {
        players[playerId] = clientId;
    });

    res.json({ players, shipsLocked });
});

// Lock ships for a player
app.post('/api/lock-ships', (req, res) => {
    const { playerId, clientId } = req.body;

    if (!playerId || !clientId) {
        return res.status(400).json({ error: "Missing playerId or clientId" });
    }

    // check this client owns this player
    if (clientToPlayer[clientId] !== playerId) {
        return res.status(403).json({ error: "Not your player" });
    }

    shipsLocked[playerId] = true;
    console.log(`Ships locked for player ${playerId}`);
    res.status(200).json({ success: true, playerId });
});

// Reset game (optional - for testing) AI helped make a reset button to test the game
app.post('/api/reset', (req, res) => {
    clientToPlayer = {};
    shipsLocked = {
        "1": false,
        "2": false,
        "3": false
    };
    console.log('Game reset');
    res.json({ success: true, message: "Game reset" });
});

app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));