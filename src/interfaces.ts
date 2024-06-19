import { GraphQLFormattedError, ValidationContext } from "graphql";

export interface WorkerData {
  configPath: string | null | undefined;
}

export interface CheckDocumentRequest {
  sourceName: string;
  sourceString: string;
}

export interface CheckDocumentOutput {
  sourceName: string;
  errors: (GraphQLFormattedError | RuleFormattedError)[];
  operations: ReadonlyArray<CheckDocumentOperationResult>;
}

export interface CheckDocumentOperationResult {
  operationName: string | undefined;
  operationKind: "query" | "mutation" | "subscription";
  issues: ReadonlyArray<Issue>;
}

export interface Issue {
  lineNumber: number;
  columnNumber: number;
  infraction: string;
  operationCoordinate: string;
  /** What needs to be added to the overrides for this coordinate for this error to be ignored? */
  override: {};
  /** e.g. "Depth 12 exceeds maximum depth 8" */
  message: string;
  /** e.g. `Paths:\n- allFoo>nodes>bars>qu>...\n- allBars>nodes>...` */
  details?: string;
}

export interface SourceLike {
  body: string;
  name: string;
}

export interface SourceResultsBySourceName {
  [sourceName: string]: {
    sourceString: string;
    output: CheckDocumentOutput;
  };
}

export interface RuleFormattedError extends GraphQLFormattedError {
  infraction: string;
  operationName: string | undefined;
  operationCoordinates: string[];
  override: GraphileConfig.OpcheckRuleConfig;
}

export interface CheckOperationsResult {
  resultsBySourceName: SourceResultsBySourceName;
}

export interface Baseline {
  version: 1;
  operations: {
    [operationName: string]:
      | {
          ignoreCoordinatesByRule: {
            [infraction: string]: string[] | undefined;
          };
        }
      | undefined;
  };
}
