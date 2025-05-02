import { KiteConnect } from "kiteconnect";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.ZERODHA_API_KEY||  "kjn";
let accessToken = process.env.KITE_ACCESS_TOKEN || "" ;

console.log(apiKey)
const kc = new KiteConnect({ api_key: apiKey });

kc.setAccessToken(accessToken);

type CustomError = {
    status: "error";
    message: string;
    data: null;
    error_type: string;
  };


export async function placeOrder(tradingSymbol: string, transactionType: "BUY" | "SELL" , quantity: number) {
    try {
      
        const order = await kc.placeOrder("regular", {
            exchange: "BSE",
            tradingsymbol: tradingSymbol,
            transaction_type: transactionType,
            quantity: quantity,
            order_type: "MARKET",
            product: "CNC",
          
        })
        return order ;
       
    } catch (e) {
        if (typeof e === "object" && e !== null && "error_type" in e) {
            const err = e as CustomError;
            // console.error(`Custom error occurred: [${err.error_type}] ${err.message}`);
            return err.message
          } else {
            console.error("Unknown error", e);
          }   
    }
}

export async function getOrderHistory() {
    try {
     
        const orders = await kc.getOrders();
        return JSON.stringify(orders);
        // return orders;
    } catch (error) {
        console.error("Error fetching order history:", error);
    }
}



