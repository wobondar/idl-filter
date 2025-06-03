export type IDLFilterConfig = {
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

interface Discriminator {
  discriminator: number[];
}

export interface IdlInstruction extends Discriminator {
  name: string;
  docs?: string[];
  accounts?: any[];
  args?: any[];
}

export interface IdlAccount extends Discriminator {
  name: string;
}

export interface IdlEvent extends Discriminator {
  name: string;
}

export interface IdlError {
  code: number;
  name: string;
  msg?: string;
}

export interface IdlTypeDef {
  name: string;
  type: any;
}

export interface IdlMetadata {
  name: string;
  version: string;
  spec: string;
  description: string;
}

export interface AnchorIdl {
  address: string;
  metadata: IdlMetadata;
  instructions?: IdlInstruction[];
  accounts?: IdlAccount[];
  events?: IdlEvent[];
  errors?: IdlError[];
  types?: IdlTypeDef[];
}
