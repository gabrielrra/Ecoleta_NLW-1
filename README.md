# Ecoleta - Server, Web e Mobile

App developed during Next Level Week, a one week bootcamp by RocketSeat.

## Server and Web

To run web app and server run `yarn prepare` or `npm run prepare`. That will install all the packages needed.

After that just run the server with `yarn start-server`.

## Mobile

The mobile part will only work with some editing.

Make sure the server is running.

Find your Pc's IP address, and change **`mobile/src/services/Api.ts`**

```ts
import Axios from 'axios';

const ip = '192.168.1.1'; //<------------CHANGE HERE
const Api = Axios.create({
  baseURL: `${ip}:3333`,
});
export default Api;
```

Start react native `yarn start` and run the app on an emulator or a physical device with `yarn android` (Must have [android environment](https://reactnative.dev/docs/environment-setup) set up)
