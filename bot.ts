// import Bot from "./app";

// async function x() {
//     const bot = new Bot("token")

//     const coins = await bot.getCurrencie()
//     console.log(coins);
// }
// x()

const socket = new WebSocket("wss://ws.bitpin.ir")

socket.addEventListener("open", (e) => {
    console.log("connect");
    socket.send(JSON.stringify({ method: "sub_to_tickers" }))
})
socket.addEventListener("message", (e) => {
    const data = JSON.parse(e.data)
    
    if(!data.message) {
        console.log(data.BTC_IRT.price);
    }
})
