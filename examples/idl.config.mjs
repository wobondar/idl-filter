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
