import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

const server = new Server(
  { name: "rest-api-tester", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "rest_get",
      description: "Make a GET request to a REST API endpoint",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "Full URL (e.g. http://localhost:8080/api/ports)" },
          headers: { type: "object", description: "Optional headers", additionalProperties: { type: "string" } },
        },
        required: ["url"],
      },
    },
    {
      name: "rest_post",
      description: "Make a POST request to a REST API endpoint",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "Full URL" },
          body: { type: "object", description: "JSON body" },
          headers: { type: "object", description: "Optional headers", additionalProperties: { type: "string" } },
        },
        required: ["url", "body"],
      },
    },
    {
      name: "rest_put",
      description: "Make a PUT request to a REST API endpoint",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "Full URL" },
          body: { type: "object", description: "JSON body" },
          headers: { type: "object", description: "Optional headers", additionalProperties: { type: "string" } },
        },
        required: ["url", "body"],
      },
    },
    {
      name: "rest_patch",
      description: "Make a PATCH request to a REST API endpoint",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "Full URL" },
          body: { type: "object", description: "JSON body" },
          headers: { type: "object", description: "Optional headers", additionalProperties: { type: "string" } },
        },
        required: ["url", "body"],
      },
    },
    {
      name: "rest_delete",
      description: "Make a DELETE request to a REST API endpoint",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "Full URL" },
          headers: { type: "object", description: "Optional headers", additionalProperties: { type: "string" } },
        },
        required: ["url"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const method = name.replace("rest_", "").toUpperCase();
  const url = args.url;
  const headers = args.headers || {};
  const body = args.body;

  try {
    const response = await axios({
      method,
      url,
      headers: { "Content-Type": "application/json", ...headers },
      data: body,
      validateStatus: () => true,
      timeout: 30000,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
              body: response.data,
            },
            null,
            2
          ),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
