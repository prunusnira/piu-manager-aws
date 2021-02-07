import DBControl from "./db.js";
import MusicInfo from "./MusicInfo.js";

export const handler = async (event: any): Promise<any> => {
    // TODO implement
    const db = new DBControl();
    const level = event.lv as number;
    const type = event.type as number;

    /**
     * 작업 순서
     * - 패턴 레벨, 타입값을 이용하여 패턴 리스트를 가져옴
     * - 가져온 패턴 리스트에서 musicid 목록을 뽑아서 음악 리스트를 가져옴
     * - 데이터 조합해서 JSON으로 보내기
     */

    const list = new Array<MusicInfo>();
    const midlist = new Set<number>();
    db.GetPatternList(level, type)
    .then(v => {
        const items = v.Items;
        const length = items.length;

        for(let i = 0; i < length; i++) {
            const info = new MusicInfo();
            info.id = items[i].id;
            info.musicid = items[i].musicid;
            info.title_ko = items[i].title_ko;
            info.title_en = items[i].title_en;
            info.lv = items[i].lv;
            info.playtype = items[i].playtype;
            info.songtype = items[i].songtype;
            info.version = items[i].version;
            info.difftype = items[i].difftype;
            info.steptype = items[i].steptype;
            info.removed = items[i].removed;
            info.new = items[i].new;
            midlist.add(items[i].musicid);

            list.push(info);
        }
    })
    .then(() => {
        const response = {
            statusCode: 200,
            body: JSON.stringify(list),
        };
        return response;
    });
};