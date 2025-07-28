import axios from "axios";

export class Bot {
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
      return [
        {
          status: result.status,
        },
      ];
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
      return [
        {
          status: result.status,
        },
      ];
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
}
const rastin = new Bot("6592f92ea8fe12320a2fb29d39cd9944dd08b465");
// rastin.getCurrencie({
  // name: "Bitcoin",
  // price: 1045255000
  // to: "IRT"
// });
// 6592f92ea8fe12320a2fb29d39cd9944dd08b465
