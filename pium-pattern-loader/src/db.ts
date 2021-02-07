import {DynamoDBClient, QueryCommand, QueryInput} from "@aws-sdk/client-dynamodb";
import {fromIni} from "@aws-sdk/credential-provider-ini"
import DBConn from "./dbconn.js";

export default class DBControl {
    db = new DynamoDBClient({
        region: DBConn.aws_region,
        credentials: fromIni({profile: "dbconn"})
    });

    GetPatternList = async (level: number, type: number): Promise<any> => {
        const query: QueryInput = {
            TableName: "piu_list",
            IndexName: "TypeLvIndex",
            KeyConditionExpression: "lv = :vlv and playtype = :vtype",
            ExpressionAttributeValues: {
                ":vlv": { "N": level.toString() },
                ":vtype": { "N": type.toString() }
            }
        };

        return await this.db.send(new QueryCommand(query));
    }
}