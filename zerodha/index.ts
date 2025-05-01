import {  getOrderHistory, placeOrder } from "./trade.controllers";
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


// Create an MCP server
const server = new McpServer({
  name: "Demo",
  version: "1.0.0"
});

// Add an addition tool
server.tool("add",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
  })
);


server.tool("get-order-history",{
    }, async () => {

    const orderHistory = await getOrderHistory();
    
    return {
        content: [{ type: "text", text: String(orderHistory) }]
    };
})

server.tool("place-order",{
    tradingSymbol: z.string(),
    transactionType: z.enum(["BUY", "SELL"]),
    quantity: z.number()
}, async ({ tradingSymbol, transactionType, quantity }) => {
    const order = await placeOrder(tradingSymbol, transactionType, quantity);
    console.log(order)
    return {
        content: [{ type: "text", text: String(order) }]
    };
})


// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);