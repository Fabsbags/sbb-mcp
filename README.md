# sbb-mcp

MCP client for the SwissTrip SBB MCP service. Connects AI assistants to live Swiss Federal Railways (SBB / CFF / FFS) data: train schedules, station search, ticket prices, and direct ticket purchase links.

The package is a thin client. All SBB API access, ticketing, and profile sync run on the hosted SwissTrip server at `https://mcp.swisstrip.app/mcp`.

## Install

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "sbb": {
      "command": "npx",
      "args": ["-y", "sbb-mcp"]
    }
  }
}
```

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "sbb": {
      "command": "npx",
      "args": ["-y", "sbb-mcp"]
    }
  }
}
```

### ChatGPT (Plus / Pro / Business / Enterprise with Developer Mode)

No install required. Add a custom connector pointing at:

```
https://mcp.swisstrip.app/mcp
```

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
| `SBB_MCP_URL` | Override the hosted server URL. Default: `https://mcp.swisstrip.app/mcp`. |

## License

Proprietary. See [LICENSE](./LICENSE). © 2026 SwissTrip.

For commercial licensing inquiries: fabsforward2@gmail.com.
