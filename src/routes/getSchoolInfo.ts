import { Router } from 'express';
import axios from 'axios';

import { asyncHandler } from '../middlewares';

import { Region, Level } from '../types';
import { SchoolInfo } from '../interfaces';

const router = Router();

const getSchoolInfo = async ({
    region,
    level,
    query
}: {
    region: keyof typeof Region,
    level: keyof typeof Level,
    query: string
}): Promise<SchoolInfo[]> => {
    const result: SchoolInfo[] = (
        await axios.get(
            'https://hcs.eduro.go.kr/v2/searchSchool',
            {
                params: {
                    lctnScCode: Region[region] + 1,
                    schulCrseScCode: Level[level] + 1,
                    orgName: query,
                    loginType: "school",
                },
            },
        )
    ).data.schulList;
    return result;
};

router.post(
    '/',
    asyncHandler(async (req, res) => {
        const { region, level, query } = req.body;

        if (!Object.values(Region).includes(region)){
            throw new Error("invalid region");
        } 
        
        if (!Object.values(Level).includes(level)) {
            throw new Error("invalid level");
        }

        const schoolInfo = await getSchoolInfo({region, level, query});

        if (!schoolInfo.length) throw new Error("no result");
        if (schoolInfo.length > 1) throw new Error("too many results");

        res.json({schoolInfo: schoolInfo[0]});
        return;
    }),
);

export default router;