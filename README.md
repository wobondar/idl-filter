# Anchor IDL Filter

[![NPM Version](https://img.shields.io/npm/v/anchor-idl-filter.svg?style=flat)](https://www.npmjs.org/package/anchor-idl-filter)
[![Install Size](https://packagephobia.now.sh/badge?p=anchor-idl-filter)](https://packagephobia.now.sh/result?p=anchor-idl-filter)
[![License](https://img.shields.io/github/license/wobondar/idl-filter?style=flat)](https://github.com/wobondar/idl-filter/blob/main/LICENSE.md)


CLI tool to filter and transform Anchor IDL (v0.30.0 or newer) files by instructions, accounts, types, events, and errors. Perfect for creating focused, lightweight IDL files for specific use cases or client-side applications.

### Features

- 🎯 **Selective Filtering**: Include or exclude specific instructions, accounts, types, events, and errors
- 📝 **Multiple Output Formats**: Export filtered IDL as JSON or TypeScript types
- ⚙️ **Flexible Configuration**: Use CLI flags or configuration files (JS, JSON, MJS, CJS)
- 🔄 **CamelCase Transformation**: Convert snake_case properties to camelCase for JavaScript/TypeScript
- 🏷️ **Custom Overrides**: Override program name, address, and TypeScript type names
- 🔍 **Dry Run Mode**: Preview filtering results before applying changes
- 📦 **Zero Dependencies**: Lightweight with minimal external dependencies
- 🏗️ **Anchor IDL Support**: Compatible with Anchor IDL format v0.30.0 or newer

### Use Cases

- **Frontend Applications**: Generate lightweight IDL types for client-side applications
- **SDK Development**: Create focused IDL files for specific SDK modules
- **Documentation**: Generate clean IDL files for documentation purposes
- **Testing**: Create minimal IDL files for unit testing
- **Integration**: Filter IDL files for specific integration scenarios

## Installation

### Global Installation

```bash
npm install -g anchor-idl-filter
# or
pnpm add -g anchor-idl-filter
# or
yarn global add anchor-idl-filter
```

### Local Installation

```bash
npm install anchor-idl-filter
# or
pnpm add anchor-idl-filter
# or
yarn add anchor-idl-filter
```

## Quick Start

### Basic Usage

```bash
# Print filtered IDL to stdout
idl-filter idl.json

# Filter with specific instructions
idl-filter --include-instructions "buy,sell" idl.json

# Export to files
idl-filter --export-json output.json --export-ts output.ts idl.json

# Use configuration file
idl-filter -c my-config.mjs idl.json

# Dry run to preview changes
idl-filter --dry-run -c config.mjs idl.json
```

## Configuration

### Configuration File

Create a configuration file to define complex filtering rules:

**⚠️ Important**: All names in configuration files and CLI arguments must **exactly match** the names as they appear in the source IDL JSON file. Names are case-sensitive and must match precisely (e.g., `"BondingCurve"` for accounts, types, and events, `"create_token"` for instructions, etc.).

**idl.config.mjs** (ES Module)
```javascript
export default {
  include: {
    instructions: ["buy", "sell", "create"],
    accounts: ["BondingCurve", "Global"],
    types: ["BondingCurve", "CompleteEvent", "CreateEvent", "Global"],
    events: ["Trade", "Complete"],
    errors: ["6001", "6002"]
  },
  exclude: {
    instructions: ["deprecated_instruction", "migrate_internal"],
    types: ["InternalType"],
    errors: ["6000"]
  },
  override: {
    name: "myprogram",
    address: "MyProgram11111111111111111111111111111111",
    tsType: "MyProgram"
  },
  output: {
    json: "output/myprogram.json",
    ts: "output/myprogram.ts"
  }
};
```

**idl.config.json** (JSON)
```json
{
  "include": {
    "instructions": ["buy", "sell"],
    "accounts": ["Pool"]
  },
  "output": {
    "json": "output/filtered.json"
  }
}
```

### Configuration File Discovery

The tool automatically looks for configuration files in this order:
1. `idl.config.mjs`
2. `idl.config.cjs`
3. `idl.config.json`
4. `idl.config.js`

## CLI Options

### Basic Options

| Option | Description |
|--------|-------------|
| `<idlPath>` | Path to Anchor IDL JSON file (required) |
| `-c, --config <path>` | Path to configuration file |
| `-d, --dry-run` | Preview changes without applying them |

### Filtering Options

| Option | Description |
|--------|-------------|
| `--include-instructions <names>` | Include specific instructions (comma-separated) |
| `--exclude-instructions <names>` | Exclude specific instructions (comma-separated) |
| `--include-accounts <names>` | Include specific accounts (comma-separated) |
| `--exclude-accounts <names>` | Exclude specific accounts (comma-separated) |
| `--include-types <names>` | Include specific types (comma-separated) |
| `--exclude-types <names>` | Exclude specific types (comma-separated) |
| `--include-events <names>` | Include specific events (comma-separated) |
| `--exclude-events <names>` | Exclude specific events (comma-separated) |
| `--include-errors <codes>` | Include specific error codes (comma-separated) |
| `--exclude-errors <codes>` | Exclude specific error codes (comma-separated) |

### Override Options

| Option | Description |
|--------|-------------|
| `--name <name>` | Override program name |
| `--address <address>` | Override program address |
| `--ts-type <type>` | Override TypeScript type name |

### Output Options

| Option | Description |
|--------|-------------|
| `--export-json <path>` | Export filtered IDL as JSON |
| `--export-ts <path>` | Export filtered IDL as TypeScript types |

## Examples

### Example 1: Trading Program Filter

Filter a DEX program to include only trading-related functionality:

```bash
idl-filter \
  --include-instructions "buy,sell,swap" \
  --include-accounts "Pool,UserAccount" \
  --include-types "TradeEvent,SwapParams" \
  --export-ts src/types/trading.ts \
  dex-program.json
```

### Example 2: Configuration-Based Filtering

**token_swap.config.mjs**
```javascript
export default {
  include: {
    instructions: ["create_market", "set_market_prices", "swap"],
    accounts: ["Market", "QuoteTokenBadge"],
    types: [
      "Market",
      "MarketFees",
      "MarketCreationEvent",
      "QuoteTokenBadge",
      "QuoteTokenBadgeStatus",
      "SwapAmountType",
      "SwapEvent",
      "SwapType",
    ],
    events: ["MarketCreationEvent", "SwapEvent"],
  },
  override: {
    name: "token_swap",
    tsType: "TokenSwap",
  },
  output: {
    ts: "output/token_swap.ts",
    json: "output/token_swap.json",
  },
};
```

```bash
idl-filter -c token_swap.config.mjs target/idl/token_swap.json
```

### Example 3: Client-Side Types Generation

Generate lightweight TypeScript types for frontend applications:

```bash
idl-filter \
  --include-instructions "initialize,deposit,withdraw" \
  --exclude-errors "6000,6001,6002" \
  --ts-type "ClientProgram" \
  --export-ts src/types/program.ts \
  program.json
```

## Output Formats

### JSON Output

The filtered IDL maintains the standard Anchor IDL structure:

```json
{
  "address": "ProgramAddress11111111111111111111111111111111",
  "metadata": {
    "name": "my_program",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [...],
  "accounts": [...],
  "types": [...],
  "events": [...],
  "errors": [...]
}
```

### TypeScript Output

Generated TypeScript files include properly typed IDL structures:

```typescript
// Auto-generated by idl-filter
export type MyProgram = {
  "address": "ProgramAddress11111111111111111111111111111111",
  "metadata": {
    "name": "myProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "swap",
      "discriminator": [102, 6, 61, 18, 1, 218, 235, 234],
      "accounts": [...],
      "args": [...]
    }
  ],
  // ... rest of IDL structure
};
```

## Advanced Usage

### Dry Run Mode

Preview filtering results before applying changes:

```bash
idl-filter --dry-run -c config.mjs program.json
```

Output:
```
--- DRY RUN REPORT ---
Address: MyProgram11111111111111111111111111111111
Metadata: { name: 'my_program', version: '0.1.0', spec: '0.1.0', description: 'Created with Anchor' }
TS Type: MyProgram
Instructions: [ 'buy', 'sell' ]
Accounts: [ 'BondingCurve', 'Global' ]
Types: [ 'BondingCurve', 'CompleteEvent' ]
Events: [ 'Trade' ]
Errors: [ 6001, 6002 ]
-----------------------
```

### CamelCase Transformation

The tool automatically converts snake_case (common in Rust-generated schemas) properties to camelCase in TypeScript output, making them suitable for JavaScript/TypeScript environments:

- `virtual_token_reserves` → `virtualTokenReserves`
- `bonding_curve` → `bondingCurve`
- `fee_basis_points` → `feeBasisPoints`

## Configuration Schema

### IDLFilterConfig Type

```typescript
type IDLFilterConfig = {
  include?: {
    instructions?: string[];
    accounts?: string[];
    types?: string[];
    events?: string[];
    errors?: string[];
  };
  exclude?: {
    instructions?: string[];
    accounts?: string[];
    types?: string[];
    events?: string[];
    errors?: string[];
  };
  override?: {
    name?: string;
    address?: string;
    tsType?: string;
  };
  output?: {
    json?: string;
    ts?: string;
  };
};
```

## Development

### Building from Source

```bash
git clone https://github.com/wobondar/idl-filter.git
cd idl-filter
pnpm install
pnpm build
```

### Bundled Dependencies

Anchor IDL Filter bundles the following open-source dependency to reduce runtime installation size:

- [`camelcase`](https://github.com/sindresorhus/camelcase) - MIT License

Bundled via [`tsup`](https://tsup.egoist.dev/) at build time.

### Running Tests

```bash
pnpm test
```

### Linting and Type Checking

```bash
pnpm lint
pnpm lint:fix
pnpm typecheck
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Repository

- **GitHub**: [https://github.com/wobondar/idl-filter](https://github.com/wobondar/idl-filter)
- **Issues**: [https://github.com/wobondar/idl-filter/issues](https://github.com/wobondar/idl-filter/issues)
- **NPM**: [https://www.npmjs.com/package/anchor-idl-filter](https://www.npmjs.com/package/anchor-idl-filter)

---

Made with ❤️ for the Solana and Anchor ecosystem.
