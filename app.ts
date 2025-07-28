import axios from "axios";

export class Bot {
  private _client;

  constructor(public readonly token: string) {
    this._client = axios.create({
      headers: {
        // Authorization: `Token ${token}`,
      },
    });

    // interface
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
  async getCurrencie(config: {
    symbol?: string | boolean,
    name?: string  | boolean,
    price?: number | boolean,
    tradable: boolean,
    } = {
        symbol: false,
        name: false,
        price: false,
        tradable: false,
    }) {


  }

}
// const rastin = new Bot("6592f92ea8fe12320a2fb29d39cd9944dd08b465");
// rastin.getCurrencies();
// 6592f92ea8fe12320a2fb29d39cd9944dd08b465
