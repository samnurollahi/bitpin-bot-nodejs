import axios from "axios";

export default class Bot {
  private _client;

  constructor(public readonly token: string) {
    this._client = axios.create({
      headers: {
        // Authorization: `Token ${token}`,
      },
    });
  }


  // get all name currencies
  async getCurrencies(
    config: {
      tradable?: boolean;
      limit?: false | number;
      sort?: "asc" | "desc";
      currency?: any;
      name?: any;
    } = {
      tradable: true,
      limit: false,
      sort: "asc",
      currency: false,
      name: false,
    }
  ) {
    let result = await this._client.get(
      "https://api.bitpin.org/api/v1/mkt/currencies/"
    ); // get data
    let data: any[] = result.data;

    // check status code
    if (result.status != 200) {
      console.log(result.status);
    }

    if (config.sort == "desc") {
      data = data.reverse();
    }
    if (config.tradable) {
      data = data.filter((item: any) => {
        return item.tradable ? item : false;
      });
    }
    if (config.limit) {
      data = data.slice(0, config.limit);
      // console.log(typeof data);
    }
    if (config.name) {
      data = data.filter((item) => {
        return item.name.toLocaleLowerCase() == config.name.toLocaleLowerCase()
          ? item
          : false;
      });
    }
    if (config.currency) {
      data = data.filter((item) => {
        return item.currency.toLocaleLowerCase() ==
          config.currency.toLocaleLowerCase()
          ? item
          : false;
      });
    }

    return data;
  }

  // currencie
  async getCurrencie(
    config: {
      currency?: string | false;
      name?: string | false;
      price?: number | false;
      to?: "IRT" | "USDT" | false;
    } = {
      currency: false,
      name: false,
      price: false,
      to: false,
    }
  ) {
    const result = await this._client.get(
      "https://api.bitpin.org/api/v1/mkt/tickers/"
    );
    let data: any[] = result.data;

    if (result.status != 200) {
      console.log(result.status);
    }

    if(config.to) {
      data = data.filter(item => {
        return item.symbol.split("_")[1] == config.to ? item : false
      })
    }
    if (config.currency) {
      data = data.filter((item) => {
        return item.symbol.split("_")[0] == config.currency ? item : false;
      });
    } else if (config.name) {
      const target: any[] = await this.getCurrencies({
        name: config.name,
      });

      data = data.filter((item) => {
        return item.symbol.split("_")[0] == target[0].currency ? item : false;
      });
    }
    if(config.price) {
      data = data.filter(item => {
        let price = config.price ?? 0
        return item.price > price ? item : false
      })
    }

    return data
  }

  webSocketTo(config: {
    currency?: string | false;
    to?: "IRT" | "USDT" | false;
  } = {
    currency: false,
    to: false
  }, callback: (data: any[], close: () => void) => void) {
    const socket = new WebSocket("wss://ws.bitpin.ir")
    const close = (): void => {
      socket.close()
    }

    socket.addEventListener("open", () => {
      console.log("socket connected");
    
      socket.send(JSON.stringify({method: "sub_to_tickers"}))
    })
    socket.addEventListener("message", (e) => {
      let data = JSON.parse(e.data)

      if(!data.message) {
        if(config.currency) {
          data = data[`${config.currency.toLocaleUpperCase()}_${config.to || "IRT"}`]
        }
        
        callback(data, close)
      }
    })
  }
}
const rastin = new Bot("6592f92ea8fe12320a2fb29d39cd9944dd08b465");
rastin.webSocketTo({
  currency: "SFM"
}, (data, closer) => {
  console.log(data);

  setTimeout(() => {
    closer()
  }, 10000)
})