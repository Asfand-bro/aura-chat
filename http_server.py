import http.server
import socketserver
import sys

class ThreadingSimpleServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True

port = 8000
handler = http.server.SimpleHTTPRequestHandler
server = ThreadingSimpleServer(("0.0.0.0", port), handler)
print(f"Serving HTTP on 0.0.0.0 port {port} (http://0.0.0.0:{port}/) ...")
try:
    server.serve_forever()
except KeyboardInterrupt:
    sys.exit(0)
