import camelCase from "camelcase";
import fs from "fs";
import path from "path";
import { AnchorIdl } from "./types";

export function loadIdlFile(idlPath: string): AnchorIdl {
  const ext = path.extname(idlPath);
  if (ext !== ".json") throw new Error(`Unsupported IDL file type. Supported types are: .json`);
  const full = path.resolve(idlPath);
  if (fs.existsSync(full)) {
    return JSON.parse(fs.readFileSync(full, "utf8"));
  } else {
    throw new Error(`IDL file "${idlPath}" not found.`);
  }
}

/**
 * Transform IDL object properties to use camelCase naming convention.
 *
 * This function processes IDL structures that typically use snake_case naming
 * (common in Rust-generated schemas) and converts them to camelCase format
 * suitable for JavaScript/TypeScript environments.
 *
 * Handles nested objects and preserves dot-notation paths by converting
 * each segment separately (e.g., "my_field.sub_field" becomes "myField.subField").
 *
 * This function is adapted from Anchor project:
 * @see {@link https://github.com/solana-foundation/anchor/blob/0bdfa3f760635cc83bbda13f9a9d22d1558d1776/ts/packages/anchor/src/idl.ts#L306-L340}
 * @license Apache-2.0
 *
 * @param idl The IDL object to transform
 * @returns A new IDL object with camelCase property names
 */
export function transformIdlCamelCase<T extends AnchorIdl>(idl: T): T {
  const TARGET_PROPERTIES = ["name", "path", "account", "relations", "generic"];

  const toCamelCase = (s: any) => s.split(".").map(camelCase).join(".");

  const transformObject = (obj: Record<string, any>) => {
    for (const key in obj) {
      const val = obj[key];
      if (TARGET_PROPERTIES.includes(key)) {
        obj[key] = Array.isArray(val) ? val.map(toCamelCase) : toCamelCase(val);
      } else if (typeof val === "object") {
        transformObject(val);
      }
    }
  };

  const transformedIdl = structuredClone(idl);
  transformObject(transformedIdl);
  return transformedIdl;
}
