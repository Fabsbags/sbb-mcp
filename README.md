# sbb-mcp

> **This package is now an alias for [`swisstrip-mcp`](https://www.npmjs.com/package/swisstrip-mcp).**
> New users should install `swisstrip-mcp` directly: it is the canonical SwissTrip MCP client.
> The `sbb-mcp` name continues to work — it spawns `swisstrip-mcp` as a child process — so existing integrations don't break.

---

Independent MCP client by SwissTrip — connects AI assistants to Swiss Federal Railways (SBB / CFF / FFS) data: train schedules, station search, ticket prices, and direct ticket purchase links via SBB's SMAPI.

Thin client. All SBB API access, ticketing, and profile sync run on the hosted SwissTrip server at `https://mcp.swisstrip.app/mcp`.

## Install (recommended: use the canonical name)

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "swisstrip": {
      "command": "npx",
      "args": ["-y", "swisstrip-mcp"]
    }
  }
}
```

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "swisstrip": {
      "command": "npx",
      "args": ["-y", "swisstrip-mcp"]
    }
  }
}
```

### ChatGPT (Plus / Pro / Business / Enterprise with Developer Mode)

No install required. Add a custom connector pointing at:

```
https://mcp.swisstrip.app/mcp
```

### Existing `sbb-mcp` configurations

Already running `npx -y sbb-mcp`? Nothing changes — it still works and forwards to the same hosted service. To migrate to the canonical name, swap `sbb-mcp` → `swisstrip-mcp` in your client config when convenient.

## Tools

- `search_stations` — find Swiss stations, addresses, and points of interest
- `search_connections` — train schedules between two stations
- `get_trip_details` — detailed trip with all intermediate stops
- `get_more_connections` — earlier or later trains for a previous search
- `get_prices` — ticket prices with Halbtax / GA discounts
- `get_ticket_link` — direct purchase link to SBB.ch
- `save_profile` / `get_profile` — save your travel profile locally
- `list_travelers` — multi-traveler family pricing (requires `SWISSTRIP_TOKEN`)

## Optional configuration

| Environment variable | Purpose |
|---|---|
| `SWISSTRIP_TOKEN` | Sync your traveler profile from your SwissTrip account. Mint at https://swisstrip.app/settings/developer. |
| `SWISSTRIP_MCP_URL` | Override the hosted server URL. Default: `https://mcp.swisstrip.app/mcp`. |
| `SBB_MCP_URL` | Same as above (legacy name, still supported). |

## Why was this renamed?

`sbb-mcp` started as the canonical npm package. To protect against future trademark conflicts (the SBB acronym belongs to Schweizerische Bundesbahnen) the canonical implementation now lives at [`swisstrip-mcp`](https://github.com/Fabsbags/swisstrip-mcp), which is registered under the SwissTrip™ trademark. `sbb-mcp` and 8 other npm names (`sbb-mcp-official`, `sbb-cff-ffs-mcp`, `swiss-rail-mcp`, `swiss-railways-mcp`, `swiss-train-mcp`, `swisstrip`, `swisstrip-ai`, `swisstrip-server`) are 1-line spawners that depend on `swisstrip-mcp`.

This means: if any one of the SBB-themed names ever needs to be transferred or removed, every existing integration keeps running unchanged because they all forward to the canonical `swisstrip-mcp`.

## License

Proprietary. See [LICENSE](./LICENSE). © 2026 SwissTrip.

For commercial licensing inquiries: fabsforward2@gmail.com.
