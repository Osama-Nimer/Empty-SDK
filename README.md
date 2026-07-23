# Empty SDK

A minimal TypeScript SDK package.

## Installation

Install directly from GitHub:

```bash
npm install github:Osama-Nimer/Empty-SDK
```

## Usage

```ts
import { EmptySDK } from "empty-sdk";

const sdk = new EmptySDK({
  apiKey: "YOUR_API_KEY_HERE",
});

const result = await sdk.ping();

console.log(result);
```

## Development

Install dependencies:

```bash
npm install
```

Build the package:

```bash
npm run build
```

Create a local installable package:

```bash
npm pack
```
