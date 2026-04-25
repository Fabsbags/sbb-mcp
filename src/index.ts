#!/usr/bin/env node
/**
 * sbb-mcp — stdio→HTTPS proxy.
 *
 * Forwards every MCP request from a local stdio transport (Claude Desktop,
 * Cursor, etc.) to the hosted SwissTrip SBB MCP server. All SBB API access,
 * ticketing, profile sync, and rendering happen on the server. This client
 * holds no credentials and no business logic.
 *
 * Override the server URL with SBB_MCP_URL.
 * Pass an optional SwissTrip account token via SWISSTRIP_TOKEN to enable
 * cloud-synced profiles and multi-traveler pricing.
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  SubscribeRequestSchema,
  UnsubscribeRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

const REMOTE_URL = process.env.SBB_MCP_URL ?? 'https://mcp.swisstrip.app/mcp'
const NAME = 'sbb-mcp'
const VERSION = '0.5.1'

async function main(): Promise<void> {
  const headers: Record<string, string> = {}
  if (process.env.SWISSTRIP_TOKEN) {
    headers.Authorization = `Bearer ${process.env.SWISSTRIP_TOKEN}`
  }

  // Upstream client — connects to the hosted MCP server over HTTPS.
  // Client capabilities advertise what THIS side supports; we don't expose
  // sampling or roots, so an empty bag is correct.
  const upstream = new Client(
    { name: `${NAME}-proxy`, version: VERSION },
    { capabilities: {} },
  )
  await upstream.connect(
    new StreamableHTTPClientTransport(new URL(REMOTE_URL), {
      requestInit: { headers },
    }),
  )

  // Local stdio server — what Claude Desktop / Cursor talk to.
  const server = new Server(
    { name: NAME, version: VERSION },
    { capabilities: { tools: {}, resources: { subscribe: true }, prompts: {} } },
  )

  // Forward every MCP request type to the upstream server.
  server.setRequestHandler(ListToolsRequestSchema, () => upstream.listTools())
  server.setRequestHandler(CallToolRequestSchema, (req) => upstream.callTool(req.params))
  server.setRequestHandler(ListResourcesRequestSchema, () => upstream.listResources())
  server.setRequestHandler(ListResourceTemplatesRequestSchema, () =>
    upstream.listResourceTemplates(),
  )
  server.setRequestHandler(ReadResourceRequestSchema, (req) => upstream.readResource(req.params))
  server.setRequestHandler(SubscribeRequestSchema, (req) => upstream.subscribeResource(req.params))
  server.setRequestHandler(UnsubscribeRequestSchema, (req) =>
    upstream.unsubscribeResource(req.params),
  )
  server.setRequestHandler(ListPromptsRequestSchema, () => upstream.listPrompts())
  server.setRequestHandler(GetPromptRequestSchema, (req) => upstream.getPrompt(req.params))

  // Forward upstream notifications (progress, list_changed, etc.) back to the agent.
  upstream.fallbackNotificationHandler = async (n) => {
    await server.notification(n)
  }

  await server.connect(new StdioServerTransport())
}

main().catch((err) => {
  console.error('[sbb-mcp]', err instanceof Error ? err.message : err)
  process.exit(1)
})
