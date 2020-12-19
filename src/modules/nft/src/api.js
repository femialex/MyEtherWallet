import fetch from 'node-fetch';
import WalletCalls from '@/apollo/queries/tokens721/index';

export default class API {
  constructor(options) {
    this.openSeaLambdaUrl = options.url;
    this.address = options.address;
    this.retryCount = 0;
    this.wallet = new WalletCalls(options.apollo);
  }

  getTokens() {
    return new Promise((resolve, reject) => {
      this.wallet.getOwnersERC721TokensBalances(this.address)
        .then(console.log)
      fetch(`${this.openSeaLambdaUrl}/nft?address=${this.address}`, {
        mode: 'cors',
        cache: 'no-cache',
        method: 'GET'
      })
        .then(data => data.json())
        .then(newData => {
          if (newData.message) {
            throw Error(newData.message);
          }
          // console.log(newData); // todo remove dev item
          resolve(newData);
        })
        .catch(error => {
          // eslint-disable-next-line
          console.error(error);
          this.retryCount++;
          if (this.retryCount < 3) {
            setTimeout(() => {
              resolve(this.getTokens());
            }, 1000);
          } else {
            reject(error);
          }
        });
    });
  }

  getNftDetailsApi(contract, params) {
    console.log(params.address, contract); // todo remove dev item
      // .then(result => {
      //   return
      // })
    fetch(`${this.openSeaLambdaUrl}/nft`, {
      mode: 'cors',
      cache: 'no-cache',
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: '',
        params,
        id: 83
      })
    })
      .then(data => data.json())
      .then(data => {
        console.log('deetail', data.result); // todo remove dev item

        return data.result.tokenContracts.find(item => {
          return item.contractIdAddress === contract;
        });
      });
    return this.wallet.getOwnersERC721Tokens(params.address, contract)

  }

  getImage(nft) {
    return `${this.openSeaLambdaUrl}/getImage?contract=${nft.contract}&tokenId=${nft.token_id}`;
  }
}
