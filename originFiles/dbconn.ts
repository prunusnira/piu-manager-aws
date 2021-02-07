import mariadb from 'mariadb';
import CommonData from './commondata';
// This file has critical info - like db username or password

class DBConn {
    private dbpool = mariadb.createPool({
        host: CommonData.DBAddr,
        port: CommonData.DBPort,
        user: CommonData.DBUser,
        password: CommonData.DBPass,
        connectionLimit: 5
    });

    // DB쿼리
    CreateQueryGetPatterns(type: number, level: string): string {
        return "SELECT\
                    a.id as ptid,\
                    b.id as musicid,\
                    b.title_en as title_en,\
                    b.title_ko as title_ko,\
                    b.artist as artist,\
                    a.type as type,\
                    a.lv as lv,\
                    a.difftype as difftype,\
                    a.steptype as steptype,\
                    b.songtype as songtype,\
                    a.removed as removed,\
                    b.version as version,\
                    b.new as new\
                FROM piu_lvtable AS a\
                JOIN (SELECT * FROM piu_songlist where removed=0) AS b\
                WHERE\
                    a.type = "+type+" AND\
                    a.lv = "+level+" AND\
                    a.musicid = b.id";
    }

    CreateQueryUserLog(name: string, type: string): string {
        return "INSERT INTO piu_userlog\
                    SET name='"+name+"', type='"+type+"', time=NOW()"
    }

    // DB 쿼리별 메소드
    async UserLog(name: string, type: string) {
        let con;
        try {
            const query: string = this.CreateQueryUserLog(name, type);
            con = await this.dbpool.getConnection();
            con.query("USE piumanager");
            con.query(query);
        }
        catch(err) {
            throw err;
        }
        finally {
            if(con) con.end();
        }
    }

    async GetPatterns(type: string, level: string) {
        let con, row;
        try {
            const query = this.CreateQueryGetPatterns(type == "s" ? 0 : 1, level);
            con = await this.dbpool.getConnection();
            con.query("USE piumanager");
            row = await con.query(query);
        }
        catch(err) {
            throw err;
        }
        finally {
            if(con) con.end();
            return row;
        }
    }

    async GetPatternsOver(type: string) {
        let con;
        let row = new Array<any>();
        try {
            const itype = type == "s" ? 0 : 1;
            con = await this.dbpool.getConnection();
            con.query("USE piumanager");

            if(itype === 0) {
                const query1 = this.CreateQueryGetPatterns(itype, "24");
                const query2 = this.CreateQueryGetPatterns(itype, "25");
                const query3 = this.CreateQueryGetPatterns(itype, "26");

                await con.query(query1).then(function(d) {
                    row = row.concat(d)
                });
                await con.query(query2).then(function(d) {
                    row = row.concat(d)
                });
                await con.query(query3).then(function(d) {
                    row = row.concat(d)
                });
            }
            else {
                const query1 = this.CreateQueryGetPatterns(itype, "25");
                const query2 = this.CreateQueryGetPatterns(itype, "26");
                const query3 = this.CreateQueryGetPatterns(itype, "27");
                const query4 = this.CreateQueryGetPatterns(itype, "28");

                await con.query(query1).then(function(d) {
                    row = row.concat(d)
                });
                await con.query(query2).then(function(d) {
                    row = row.concat(d)
                });
                await con.query(query3).then(function(d) {
                    row = row.concat(d)
                });
                await con.query(query4).then(function(d) {
                    row = row.concat(d)
                });
            }
        }
        catch(err) {
            throw err;
        }
        finally {
            if(con) con.end();
            return row;
        }
    }
}

export default DBConn;