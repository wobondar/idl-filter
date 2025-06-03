# Examples

This directory contains practical examples demonstrating how to use `anchor-idl-filter` to create focused, lightweight IDL files from complex Anchor programs.

## Overview

The examples showcase filtering a real-world Solana program IDL - the **pump.fun** token creation and trading platform. The original IDL contains numerous instructions, accounts, types, events, and errors. Using `anchor-idl-filter`, we create a simplified "PumpLite" version that includes only the core trading functionality.

## Directory Structure

```
examples/
├── README.md              # This file
├── idl.config.mjs         # Configuration file for filtering
├── idl/
│   └── pump.json          # Source IDL file (pump.fun program)
└── output/
    ├── pumplite.json      # Filtered IDL (JSON format)
    └── pumplite.ts        # Filtered IDL (TypeScript types)
```

## Running the Example

### Prerequisites

Ensure you have `anchor-idl-filter` installed:

```bash
npm install -g anchor-idl-filter
# or
pnpm add -g anchor-idl-filter
```

### Execute Filtering

From the `examples/` directory:

```bash
# Config auto-discovery
idl-filter idl/pump.json

# Or using specific configuration file
idl-filter -c idl.config.mjs idl/pump.json

# Or run with explicit CLI options
idl-filter \
  --include-instructions "buy,sell,create" \
  --include-accounts "BondingCurve,Global" \
  --include-types "BondingCurve,CompleteEvent,CreateEvent,Global,TradeEvent" \
  --exclude-events "CollectCreatorFeeEvent,CompletePumpAmmMigrationEvent,ExtendAccountEvent,SetCreatorEvent,SetMetaplexCreatorEvent,SetParamsEvent,UpdateGlobalAuthorityEvent" \
  --exclude-errors "6008,6009" \
  --name "pump_lite" \
  --ts-type "PumpLite" \
  --export-json "output/pumplite.json" \
  --export-ts "output/pumplite.ts" \
  idl/pump.json
```

### Dry Run Preview

Preview the filtering results without generating files:

```bash
idl-filter --dry-run -c idl.config.mjs idl/pump.json
```

Expected output:
```
--- DRY RUN REPORT ---
Address: 6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P
Metadata: { name: 'pump_lite', version: '0.1.0', spec: '0.1.0', description: 'Created with Anchor' }
TS Type: PumpLite
Instructions: [ 'buy', 'sell', 'create' ]
Accounts: [ 'BondingCurve', 'Global' ]
Types: [ 'BondingCurve', 'CompleteEvent', 'CreateEvent', 'Global', 'TradeEvent' ]
Events: [ 'CompleteEvent', 'CreateEvent', 'TradeEvent' ]
Errors: [ 6000, 6001, 6002, 6003, 6004, 6005, 6006, 6007, 6010, 6011, 6012, 6013, 6014, 6015, 6016, 6017, 6018, 6019, 6020, 6021, 6022, 6023, 6024, 6025, 6026, 6027, 6028, 6029, 6030 ]
-----------------------
```

## Comparison: Before vs After

| Aspect | Original IDL | Filtered IDL | Reduction |
|--------|-------------|--------------|-----------|
| **File Size** | 46KB | 28KB | 40% |
| **Instructions** | 12 | 3 | 75% |
| **Events** | 10 | 3 | 70% |
| **Errors** | 31 | 29 | 6% |
| **Types** | 15 | 5 | 67% |
| **Accounts** | 2 | 2 | 0% |

## Source IDL: pump.fun Program

**File**: `idl/pump.json`

The source IDL represents the complete pump.fun program with:

- **Address**: `6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P`
- **Instructions**: 12 total (buy, sell, create, collect_creator_fee, etc.)
- **Accounts**: 2 (BondingCurve, Global)
- **Events**: 10 total (TradeEvent, CreateEvent, CompleteEvent, etc.)
- **Errors**: 31 error codes (6000-6030)
- **Types**: 15 type definitions

### Key Instructions in Source IDL

- `buy` - Buys tokens from a bonding curve
- `sell` - Sells tokens into a bonding curve  
- `create` - Creates a new coin and bonding curve
- `collect_creator_fee` - Collects creator fees
- `complete_pump_amm_migration` - Migrates to AMM
- `extend_account` - Extends account size
- `initialize` - Initializes the program
- `set_creator` - Sets creator authority
- `set_metaplex_creator` - Sets Metaplex creator
- `set_params` - Updates program parameters
- `update_global_authority` - Updates global authority
- `withdraw` - Withdraws funds

## Configuration: PumpLite Filter

**File**: `idl.config.mjs`

```javascript
export default {
  include: {
    instructions: ["buy", "sell", "create"],
    accounts: ["BondingCurve", "Global"],
    types: ["BondingCurve", "CompleteEvent", "CreateEvent", "Global", "TradeEvent"],
  },
  exclude: {
    events: [
      "CollectCreatorFeeEvent",
      "CompletePumpAmmMigrationEvent", 
      "ExtendAccountEvent",
      "SetCreatorEvent",
      "SetMetaplexCreatorEvent",
      "SetParamsEvent",
      "UpdateGlobalAuthorityEvent",
    ],
    errors: ["6008", "6009"],
  },
  override: {
    name: "pump_lite",
    tsType: "PumpLite",
  },
  output: {
    ts: "output/pumplite.ts",
    json: "output/pumplite.json",
  },
};
```

### Filtering Strategy

**Included Elements:**
- **Instructions**: Only core trading functions (`buy`, `sell`, `create`)
- **Accounts**: Essential account types (`BondingCurve`, `Global`)
- **Types**: Core data structures needed for trading operations
- **Events**: Automatically includes `CompleteEvent`, `CreateEvent`, `TradeEvent` (not explicitly excluded)
- **Errors**: All errors except `6008` (WithdrawTooFrequent) and `6009` (NewSizeShouldBeGreaterThanCurrentSize)

**Excluded Elements:**
- **Instructions**: Administrative functions (initialize, set_params, withdraw, etc.)
- **Events**: Administrative events (fee collection, migration, parameter updates, etc.)
- **Errors**: Non-essential error codes for basic trading

**Overrides:**
- **Program Name**: `pump` → `pump_lite`
- **TypeScript Type**: `PumpLite`

## Filtered Output

### JSON Output: `output/pumplite.json`

The filtered IDL maintains the standard Anchor IDL structure but contains only the selected elements:

```json
{
  "address": "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
  "metadata": {
    "name": "pump_lite",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    // Only buy, sell, create instructions
  ],
  "accounts": [
    // Only BondingCurve, Global accounts
  ],
  "events": [
    // Only CompleteEvent, CreateEvent, TradeEvent
  ],
  "errors": [
    // All errors except 6008, 6009
  ],
  "types": [
    // Only specified types
  ]
}
```

**Size Reduction**: ~46KB → ~28KB (40% reduction)

### TypeScript Output: `output/pumplite.ts`

The TypeScript output includes camelCase transformation for JavaScript/TypeScript compatibility:

```typescript
// Auto-generated by idl-filter
export type PumpLite = {
  "address": "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
  "metadata": {
    "name": "pumpLite",  // camelCase transformation
    "version": "0.1.0",
    "spec": "0.1.0", 
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "buy",
      "accounts": [
        {
          "name": "feeRecipient",      // fee_recipient → feeRecipient
          "writable": true
        },
        {
          "name": "bondingCurve",      // bonding_curve → bondingCurve
          "writable": true
        },
        {
          "name": "associatedUser",    // associated_user → associatedUser
          "writable": true
        }
        // ... more accounts
      ],
      "args": [
        {
          "name": "maxSolCost",        // max_sol_cost → maxSolCost
          "type": "u64"
        }
      ]
    }
    // ... more instructions
  ]
  // ... rest of IDL
};
```



## Key Learnings

1. **Exact Name Matching**: Configuration names must exactly match IDL names (case-sensitive)
2. **Selective Filtering**: Include/exclude patterns allow precise control over output
3. **Size Optimization**: Significant file size reduction while maintaining functionality

## Next Steps

Try modifying the configuration to:

1. **Include different instructions**: Add `collect_creator_fee` for creator functionality
2. **Exclude more events**: Remove `CreateEvent` for trading-only interfaces  
3. **Filter errors**: Include only trading-related error codes (6002-6006)
4. **Change output names**: Experiment with different program names and TypeScript types

This example demonstrates the power of `anchor-idl-filter` for creating focused, maintainable IDL files tailored to specific use cases. 