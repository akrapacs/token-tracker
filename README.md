# Token Tracker

Tracks a handful of crypto tokens against their all-time highs (ATH), using the free [CoinGecko](https://www.coingecko.com) API. Deployed to GitHub Pages at https://akrapacs.github.io/token-tracker/. Its sibling project is [metals-tracker](https://github.com/akrapacs/metals-tracker).

## What it shows

Tokens are sorted by USD price. For each one:

| Column | Meaning |
| --- | --- |
| USD Price | Current price |
| ATH Decay | How much further below its ATH the token is than BTC is, in percentage points of ATH. Shown only when the token is further from its ATH than BTC |
| BTC Price | Price in BTC |
| ATH | All-time high in USD |
| % of ATH | Current price as a percentage of the ATH |
| From ATH | How far the price has fallen from the ATH |
| To ATH | How much the price would need to rise to get back to the ATH |

Rows are highlighted when ATH Decay is above zero but under the **Threshold** setting (default 6%), meaning the token is tracking just behind BTC's recovery toward its ATH.

- **Desktop:** all columns. Click a number to copy it.
- **Mobile:** symbol, price, and ATH Decay. Tap a row for the full details.
- Each symbol links to the token's CoinGecko page.

The **Update Interval** setting (minutes, default 10) controls how often prices refresh. Both settings are saved in the browser's local storage.

## Choosing tokens

Tokens are listed in `src/const/subscriptions.ts`. To add one, add an entry; to disable one, comment it out.

```ts
{
  cg: 'bitcoin',    // CoinGecko coin ID (from the coin's URL on coingecko.com)
  cmc: 1,           // CoinMarketCap ID, used only by the CoinMarketCap route below
  symbol: 'BTC',
  ath: 73738.00,    // used only by the CoinMarketCap route; CoinGecko provides the ATH itself
},
```

Keep `bitcoin` in the list, since ATH Decay and BTC prices are calculated relative to it.

## CoinMarketCap (optional, needs a server)

`src/pages/api/cmc.ts` is an alternative data source that calls CoinMarketCap with a `CMC_API_KEY` environment variable. It's an API route, so it only works when the app runs on a server, such as `npm run dev`; it isn't included in the GitHub Pages build (`next.config.js` only enables the static export for production builds). To use it, set `NEXT_PUBLIC_API_URL` to the app's API base (e.g. `http://localhost:3000/token-tracker/api`) and call `useApi(ApiType.CoinMarketCap)` in `src/pages/index.tsx`.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000/token-tracker.

`npm run build` produces the static site in `out/`. Don't run it while `npm run dev` is running; they share the `.next` folder.

## Deployment

Pushing to `main` runs `.github/workflows/nextjs.yml`, which builds the static export and deploys it to GitHub Pages (Settings > Pages > Source: **GitHub Actions**).
