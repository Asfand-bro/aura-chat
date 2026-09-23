const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static('./'));

let waiting_pool = [];
const rooms = new Map();

function isMatch(u1, u2) {
    const match1 = u1.match_gender === 'any' || u1.match_gender === u2.my_gender;
    const match2 = u2.match_gender === 'any' || u2.match_gender === u1.my_gender;
    return match1 && match2;
}

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'find_match') {
            const newUser = { ws, my_gender: data.my_gender, match_gender: data.match_gender };
            let matchedUser = null;
            for (let i = 0; i < waiting_pool.length; i++) {
                if (isMatch(newUser, waiting_pool[i])) {
                    matchedUser = waiting_pool[i];
                    break;
                }
            }
            if (matchedUser) {
                waiting_pool = waiting_pool.filter(u => u !== matchedUser);
                rooms.set(ws, matchedUser.ws);
                rooms.set(matchedUser.ws, ws);
                ws.send(JSON.stringify({ type: 'match_found' }));
                matchedUser.ws.send(JSON.stringify({ type: 'match_found' }));
            } else {
                waiting_pool.push(newUser);
            }
        } else if (data.type === 'message' || data.type === 'image') {
            const partner = rooms.get(ws);
            if (partner && partner.readyState === 1) {
                partner.send(message.toString());
            }
        }
    });

    ws.on('close', () => {
        waiting_pool = waiting_pool.filter(u => u.ws !== ws);
        const partner = rooms.get(ws);
        if (partner) {
            rooms.delete(ws);
            rooms.delete(partner);
            if (partner.readyState === 1) {
                partner.send(JSON.stringify({ type: 'stranger_disconnected' }));
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});
