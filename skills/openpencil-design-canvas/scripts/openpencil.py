"""Minimal OpenPencil MCP client for the desktop app on :7600.

Replaces the handshake boilerplate that gets rewritten every session.
Run it on the Mac (the endpoint is app-local). Token rotates on relaunch:
  export MCP_TOKEN=$(python3 -c "import json,pathlib;print(json.loads(pathlib.Path.home().joinpath('Library/Application Support/OpenPencil/mcp.json').read_text())['authToken'])")

  python3 openpencil.py probe                  # connect + tool count
  python3 openpencil.py tree                   # page tree

Import for real work:
  from openpencil import OP
  with OP() as op:
      root = op.first("Clearing Landing")
      op.call("update_node", {"id": root, "height": 4668})
      op.verify(root, height=4668)             # ack != proof
"""
import json
import os
import sys

import requests


class OP:
    def __init__(self, base=None, token=None, timeout=120):
        self.base = base or os.environ.get("MCP_URL", "http://127.0.0.1:7600/mcp")
        self.token = token or os.environ["MCP_TOKEN"]
        self.timeout = timeout
        self.h = {"Authorization": "Bearer " + self.token,
                  "Content-Type": "application/json",
                  "Accept": "application/json, text/event-stream"}
        self._id = 0

    # -- transport ---------------------------------------------------------
    def _next(self):
        self._id += 1
        return self._id

    def _parse(self, r):
        sid = r.headers.get("mcp-session-id")
        if sid:
            self.h["Mcp-Session-Id"] = sid
        if "text/event-stream" in r.headers.get("content-type", ""):
            out = None
            for line in r.text.splitlines():
                if line.startswith("data: "):
                    try:
                        out = json.loads(line[6:])
                    except Exception:
                        pass
            return out
        try:
            return r.json()
        except Exception:
            return {"raw": r.text[:300]}

    def rpc(self, method, params=None):
        return self._parse(requests.post(
            self.base, headers=self.h, timeout=self.timeout,
            json={"jsonrpc": "2.0", "id": self._next(),
                  "method": method, "params": params or {}}))

    def connect(self):
        self.rpc("initialize", {"protocolVersion": "2024-11-05",
                                "capabilities": {},
                                "clientInfo": {"name": "hermes",
                                               "version": "1.0"}})
        requests.post(self.base, headers=self.h, timeout=15,
                      json={"jsonrpc": "2.0",
                            "method": "notifications/initialized"})
        return self

    def close(self):
        try:
            requests.delete(self.base, headers=self.h, timeout=10)
        except Exception:
            pass

    def __enter__(self):
        return self.connect()

    def __exit__(self, *a):
        self.close()

    # -- tools -------------------------------------------------------------
    def call(self, name, args=None):
        r = self.rpc("tools/call", {"name": name, "arguments": args or {}})
        if not r:
            return {"error": "no response"}
        if "error" in r:
            return r
        try:
            return json.loads(r["result"]["content"][0]["text"])
        except Exception:
            return r

    def tools(self):
        r = self.rpc("tools/list")
        return [t["name"] for t in (r.get("result") or {}).get("tools", [])]

    def find(self, name):
        """Every node with this name. Re-imports leave duplicates."""
        return [n["id"] for n in (self.call("find_nodes", {"name": name})
                                   .get("nodes") or [])]

    def first(self, name):
        ids = self.find(name)
        return ids[0] if ids else None

    def get(self, node_id):
        return self.call("get_node", {"id": node_id})

    def verify(self, node_id, **props):
        """Re-read after a write; re-issue once on mismatch. Returns the drift."""
        g = self.get(node_id)
        bad = {k: (v, g.get(k)) for k, v in props.items() if g.get(k) != v}
        if not bad:
            return {}
        self.call("update_node", {"id": node_id, **props})
        g = self.get(node_id)
        return {k: (v, g.get(k)) for k, v in props.items() if g.get(k) != v}

    def render(self, jsx, parent_id=None, x=None, y=None):
        a = {"jsx": jsx}
        if parent_id:
            a["parent_id"] = parent_id
        if x is not None:
            a["x"] = x
        if y is not None:
            a["y"] = y
        return self.call("render", a)

    def export(self, ids, path, max_edge=1440, fmt="PNG"):
        """Step max_edge down until the 20s RPC cap stops biting."""
        for edge in (max_edge, 1800, 1200, 900):
            r = self.call("export_image", {"ids": ids if isinstance(ids, list)
                                           else [ids], "format": fmt, "scale": 1,
                                           "maxEdge": edge, "path": path})
            if r.get("written"):
                return r
        return r

    def save(self, path):
        return self.call("save_file", {"path": path})


def main(argv):
    cmd = argv[1] if len(argv) > 1 else "probe"
    with OP() as op:
        if cmd == "probe":
            t = op.tools()
            print(f"{len(t)} tools")
            print(", ".join(t[:12]), "...")
        elif cmd == "tree":
            print(json.dumps(op.call("get_page_tree", {}), indent=2)[:4000])
        else:
            print(__doc__)


if __name__ == "__main__":
    main(sys.argv)
