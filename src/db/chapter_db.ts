import { Database } from "sqlite3";

export class ChapterDb {
  constructor(dbpool: Database) {
    this.dbpool = dbpool;
  }

  dbpool: Database;

  public insert(id_manga: string) {
    this.dbpool
      .run(`INSERT INTO chapter (chapter_id) VALUES("${id_manga}")`)
      .exec();
  }

  public findOne(callback?: (err: Error, rows: any[]) => void): string {
    var a = [];

    this.dbpool.serialize(() => {
      this.dbpool.all(`select * from chapter limit 1`, callback);
    });
    if (a.length > 0) {
      return a[0];
    }
    return "";
  }
}

export interface ChapterDbModel {
  chapter_id: string;
}
