export interface TableRow {
  [key: string]: any;
}

export interface Expanded<T> {
  openedRows: T[];
  row: T | null;
}
