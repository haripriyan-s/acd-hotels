#!/usr/bin/env python3
"""Tiny static file server for local preview of the ACD Hotels site."""
import functools
import http.server
import os
import socketserver
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4174


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


if __name__ == "__main__":
    os.chdir(ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    handler = functools.partial(Handler, directory=ROOT)
    with socketserver.TCPServer(("127.0.0.1", PORT), handler) as httpd:
        print("ACD Hotels site serving on http://127.0.0.1:%d/" % PORT)
        sys.stdout.flush()
        httpd.serve_forever()
