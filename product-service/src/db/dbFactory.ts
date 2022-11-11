import PG from './pgClient';

export enum dbNames {
  POSTGRES = 'postgres',
}

export default class DBFactory {
  static getDB(dbName: dbNames, dbConfig) {
    if (dbName == dbNames.POSTGRES) {
      return new PG(dbConfig);
    }
  }
}
