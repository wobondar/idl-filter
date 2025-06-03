import { Command } from "commander";
import camelCase from "camelcase";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { IDLFilterConfig } from "./types";
import { loadIdlFile, transformIdlCamelCase } from "./idl";

const { version, description } = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8"));

const program = new Command()
  .name("idl-filter")
  .version(version)
  .description(description)
  .showHelpAfterError()
  .addHelpText(
    "after",
    `
Example (by default prints IDL JSON to stdout):
  $ idl-filter idl.json

Example with config file:
  $ idl-filter -c custom.config.mjs idl.json

Example exporting IDL JSON to file:
  $ idl-filter --export-json output/program.json idl.json
`,
  )
  .argument("<idlPath>", "Path to Anchor IDL JSON file")
  .option(
    "-c, --config <configPath>",
    "Path to config file. Defaults to idl.config.mjs, idl.config.cjs, idl.config.json, idl.config.js in the current directory.",
  )
  .option("--include-instructions <names>", "Include instructions by name (comma separated)")
  .option("--exclude-instructions <names>", "Exclude instructions by name (comma separated)")
  .option("--include-accounts <names>", "Include accounts by name (comma separated)")
  .option("--exclude-accounts <names>", "Exclude accounts by name (comma separated)")
  .option("--include-types <names>", "Include types by name (comma separated)")
  .option("--exclude-types <names>", "Exclude types by name (comma separated)")
  .option("--include-events <names>", "Include events by name (comma separated)")
  .option("--exclude-events <names>", "Exclude events by name (comma separated)")
  .option("--include-errors <codes>", "Include errors by code (comma separated)")
  .option("--exclude-errors <codes>", "Exclude errors by code (comma separated)")
  .option("--name <name>", "Override program name")
  .option("--address <address>", "Override program address")
  .option("--ts-type <type>", "Override TypeScript type name")
  .option("--export-json <outputPath>", "Path to export JSON file")
  .option("--export-ts <outputPath>", "Path to export TS file")
  .option("-d, --dry-run", "Dry run mode")
  .parse();

async function loadConfig(configPath?: string): Promise<IDLFilterConfig | null> {
  if (configPath) {
    const full = path.resolve(process.cwd(), configPath);
    if (fs.existsSync(full)) {
      if (full.endsWith(".json")) {
        return JSON.parse(fs.readFileSync(full, "utf8"));
      } else if (full.endsWith(".mjs") || full.endsWith(".cjs") || full.endsWith(".js")) {
        const mod = await import(pathToFileURL(full).href);
        return mod.default || mod;
      } else {
        program.error(`Unsupported config file type. Supported types are: .mjs, .cjs, .json, .js`);
        return null;
      }
    }
    program.error(`Config file "${configPath}" not found.`);
    return null;
  }
  const configNames = ["idl.config.mjs", "idl.config.cjs", "idl.config.json", "idl.config.js"];
  for (const file of configNames) {
    const full = path.resolve(process.cwd(), file);
    if (fs.existsSync(full)) {
      if (file.endsWith(".json")) {
        return JSON.parse(fs.readFileSync(full, "utf8"));
      } else {
        const mod = await import(pathToFileURL(full).href);
        return mod.default || mod;
      }
    }
  }
  return null;
}

function parseValues(val?: string): string[] {
  return (
    val
      ?.split(",")
      .map((x) => x.trim())
      .filter(Boolean) ?? []
  );
}

function filterSection<T extends { name?: string; code?: number }>(
  list: T[] | undefined,
  field: "name" | "code",
  include?: string[],
  exclude?: string[],
): T[] | undefined {
  if (!list) return undefined;
  let filtered = list;
  if (include?.length) filtered = filtered.filter((x) => include.includes(String(x[field])));
  if (exclude?.length) filtered = filtered.filter((x) => !exclude.includes(String(x[field])));
  return filtered;
}

(async () => {
  const opts = program.opts();
  const [idlPath] = program.args;
  const config = await loadConfig(opts.config);

  const include = config?.include ?? {
    instructions: parseValues(opts.includeInstructions),
    accounts: parseValues(opts.includeAccounts),
    types: parseValues(opts.includeTypes),
    events: parseValues(opts.includeEvents),
    errors: parseValues(opts.includeErrors),
  };

  const exclude = config?.exclude ?? {
    instructions: parseValues(opts.excludeInstructions),
    accounts: parseValues(opts.excludeAccounts),
    types: parseValues(opts.excludeTypes),
    events: parseValues(opts.excludeEvents),
    errors: parseValues(opts.excludeErrors),
  };

  const exportJsonPath = config?.output?.json ?? opts.exportJson;
  const exportTsPath = config?.output?.ts ?? opts.exportTs;

  try {
    const idl = loadIdlFile(idlPath);
    idl.instructions = filterSection(idl.instructions, "name", include.instructions, exclude.instructions);
    idl.accounts = filterSection(idl.accounts, "name", include.accounts, exclude.accounts);
    idl.types = filterSection(idl.types, "name", include.types, exclude.types);
    idl.events = filterSection(idl.events, "name", include.events, exclude.events);
    idl.errors = filterSection(idl.errors, "code", include.errors, exclude.errors);

    const programName = opts?.name ?? config?.override?.name;
    if (programName) idl.metadata.name = programName;

    const programAddress = opts?.address ?? config?.override?.address;
    if (programAddress) idl.address = programAddress;

    const tsType = opts?.tsType ?? config?.override?.tsType ?? camelCase(idl.metadata.name, { pascalCase: true });

    if (opts.dryRun) {
      const listNames = <T extends { name?: string; code?: number }>(list: T[] | undefined, field: "name" | "code") =>
        list?.map((x) => x[field]) ?? [];

      console.log("--- DRY RUN REPORT ---");
      console.log("Address:", idl.address);
      console.log("Metadata:", idl.metadata);
      console.log("TS Type:", tsType);
      console.log("Instructions:", listNames(idl.instructions, "name"));
      console.log("Accounts:", listNames(idl.accounts, "name"));
      console.log("Types:", listNames(idl.types, "name"));
      console.log("Events:", listNames(idl.events, "name"));
      console.log("Errors:", listNames(idl.errors, "code"));
      console.log("-----------------------");
      process.exit(0);
    }

    if (!exportJsonPath && !exportTsPath) {
      console.log(JSON.stringify(idl, null, 2));
      return;
    }

    if (exportJsonPath) {
      fs.writeFileSync(exportJsonPath, JSON.stringify(idl, null, 2));
      console.log(`✅ Exported JSON IDL to ${exportJsonPath}`);
    }
    if (exportTsPath) {
      fs.writeFileSync(
        exportTsPath,
        `// Auto-generated by idl-filter
export type ${tsType} = ${JSON.stringify(transformIdlCamelCase(idl), null, 2)};
`,
      );
      console.log(`✅ Exported TypeScript IDL types to ${exportTsPath}`);
    }
  } catch (error) {
    program.error(error instanceof Error ? error.message : "Unknown error");
  }
})();
