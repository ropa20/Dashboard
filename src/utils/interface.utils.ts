export interface IAddValues {
  key: string;
  label: string;
  type:
    | "string"
    | "file"
    | "files"
    | "select"
    | "number"
    | "address"
    | "store"
    | "organization"
    | "user"
    | "vehicle"
    | "driver"
    | "store_driver"
    | "date"
    | "title"
    | "status"
    | "checkbox"
    | "own_vehicle"
    | "payment_type"
    | "city"
    | "dedicated_org"
    | "driver_status"
    | "passbook"
    | "hub"
    | "remarks";
  isNested?: boolean;
  condition?: any;
  additionalInfo?: string;
  options?: {
    value: number | string | boolean;
    label: string;
  }[];
}

export enum MapTypeId {
  Roadmap = "roadmap",
  Satellite = "satellite",
  Hybrid = "hybrid",
  Terrain = "terrain",
}
