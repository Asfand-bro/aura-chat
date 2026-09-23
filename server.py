import asyncio
import json
import websockets
import logging

logging.basicConfig(level=logging.INFO)

waiting_pool = []  # List of dicts: {'ws': ws, 'my_gender': str, 'match_gender': str}
rooms = {}  # Map ws -> partner_ws

def is_match(u1, u2):
    # u1 is the new user, u2 is a user in the waiting pool
    u1_wants = u1['match_gender']
    u1_is = u1['my_gender']
    
    u2_wants = u2['match_gender']
    u2_is = u2['my_gender']
    
    match1 = (u1_wants == 'any' or u1_wants == u2_is)
    match2 = (u2_wants == 'any' or u2_wants == u1_is)
    
    return match1 and match2

async def handle_client(ws):
    logging.info("Client connected")
    try:
        async for message in ws:
            data = json.loads(message)
            msg_type = data.get('type')
            
            if msg_type == 'find_match':
                my_gender = data.get('my_gender')
                match_gender = data.get('match_gender')
                
                new_user = {'ws': ws, 'my_gender': my_gender, 'match_gender': match_gender}
                matched_user = None
                
                # Search for a match
                for user in waiting_pool:
                    if is_match(new_user, user):
                        matched_user = user
                        break
                        
                if matched_user:
                    waiting_pool.remove(matched_user)
                    partner_ws = matched_user['ws']
                    
                    rooms[ws] = partner_ws
                    rooms[partner_ws] = ws
                    
                    await ws.send(json.dumps({'type': 'match_found'}))
                    await partner_ws.send(json.dumps({'type': 'match_found'}))
                    logging.info("Matched two users")
                else:
                    waiting_pool.append(new_user)
                    logging.info("User added to waiting pool")
                    
            elif msg_type == 'message' or msg_type == 'image':
                partner_ws = rooms.get(ws)
                if partner_ws:
                    await partner_ws.send(message) # Forward the same JSON
                    
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        # Cleanup
        logging.info("Client disconnected")
        # Remove from waiting pool if there
        waiting_pool[:] = [u for u in waiting_pool if u['ws'] != ws]
        
        # Remove from rooms and notify partner
        partner_ws = rooms.pop(ws, None)
        if partner_ws:
            rooms.pop(partner_ws, None)
            try:
                await partner_ws.send(json.dumps({'type': 'stranger_disconnected'}))
            except Exception:
                pass

async def main():
    async with websockets.serve(handle_client, "0.0.0.0", 8765):
        logging.info("WebSocket server started on ws://localhost:8765")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
