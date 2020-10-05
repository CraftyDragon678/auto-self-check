import { Express, Router } from 'express'
import axios from 'axios'

import { asyncHandler, encryptor } from './middlewares'
import { Region, Level } from './enum'

const router = Router();

router.post(
    '/getUserData',
    asyncHandler(async (req, res) => {
        const { name, birthday, schoolCode } = req.body;
        const response = await axios.post(
            'https://goehcs.eduro.go.kr/v2/findUser',
            {
                "orgCode": schoolCode,
                "name": encryptor.encrypt(name),
                "birthday": encryptor.encrypt(birthday),
                "stdntPNo": null,
                "loginType": "school",
            },
        )
            .catch(err => {
                return null;
            })
        if (!response) {
            res.json({success: false});
        } else {
            res.json(response.data);
        }
    }),
)

const pad2 = (num: Number) => num.toString().padStart(2, '0')
const formatDate = (date: Date) => pad2(date.getFullYear() - 2000) + pad2(date.getMonth() + 1) + pad2(date.getDate())
const checkBirthday = async ({
    name,
    date,
    schoolCode
}: {
    name: string,
    date: string,
    schoolCode: string
}) => {
    return await axios.post(
        "https://goehcs.eduro.go.kr/v2/findUser",
        {
            "orgCode": schoolCode,
            "name": encryptor.encrypt(name),
            "birthday": encryptor.encrypt(date),
            "stdntPNo": null,
            "loginType": "school",
        }
    )
        .then(response => {
            return date;
        })
        .catch(err => {
            return false;
        })
}

router.post(
    '/getBirthday',
    asyncHandler(async (req, res) => {
        const { name, schoolCode, year } = req.body;
        const baseDate = + new Date(year, 0, 1);
        Promise.all(
            [...Array(year % 4 ? 365 : 366).keys()]
                .map(e => formatDate(new Date(baseDate + 60 * 60 * 24 * 1000 * e)))
                .map(date => checkBirthday({
                    "name": name,
                    "date": date,
                    "schoolCode": schoolCode,
                }))
        )
            .then(result => result.filter(Boolean))
            .then(result => {
                if (!result.length) {
                    res.json({ success: false });
                } else {
                    res.json({ success: true, birthday: result });
                }
            });
    }),
)

router.post(
    '/getSchoolCode',
    asyncHandler(async (req, res) => {
        const { region, level, query } = req.body;

        const response = await axios.get(
            'https://hcs.eduro.go.kr/v2/searchSchool',
            {
                params: {
                    lctnScCode: Region[region] + 1,
                    schulCrseScCode: Level[level] + 1,
                    orgName: query,
                    loginType: "school",
                },
            },
        );

        const result = response.data.schulList;
        if (!result.length) {
            res.json({ success: false, message: "no result" });
        } else if (result.length > 1) {
            res.json({ success: false, message: "too many results" });
        } else {
            res.json({ success: true, schoolCode: result[0].orgCode });
        }
    }),
)

router.post(
    '/registerSurvey',
    asyncHandler(async (req, res) => {
        const { name, token } = req.body;

        const response = await axios.post(
            "https://goehcs.eduro.go.kr/registerServey",
            {
                "rspns01": "1",
                "rspns02": "1",
                "rspns03": null,
                "rspns04": null,
                "rspns05": null,
                "rspns06": null,
                "rspns07": "0",
                "rspns08": "0",
                "rspns09": "0",
                "rspns10": null,
                "rspns11": null,
                "rspns12": null,
                "rspns13": null,
                "rspns14": null,
                "rspns15": null,
                "rspns00": "Y",
                "deviceUuid": "",
                "upperToken": token,
                "upperUserNameEncpt": name
            },
            {
                headers: {
                    "Authorization": token,
                },
            },
        );

        if (response.status !== 200) {
            res.json({ success: false });
        } else if (!response.data.registerDtm) {
            res.json({ success: false });
        } else {
            res.json({ success: true, registerTime: response.data.registerDtm });
        }
    }),
);

export default (app: Express): void => {
    app.use('/', router);
}