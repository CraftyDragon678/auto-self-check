import { Router } from 'express';
import axios from 'axios';

import { asyncHandler } from '../middlewares'

import db from '../db';

const router = Router();

router.get(
    '/',
    asyncHandler(async (req, res) => {
        const { name, year, region, level, query } = req.query as {
            name?: string;
            year?: string;
            region?: string;
            level?: string;
            query?: string;
        };

        if (!name || !year || !region || !level || !query) throw new Error("query error");

        const schoolCode = (
            await axios.post('http://localhost:2932/getSchoolInfo', {region, level, query})
        ).data.schoolInfo.orgCode;

        const birthday = (
            await db.query('SELECT birthday FROM users WHERE name = $1 AND schoolCode = $2 AND year = $3;', [name, schoolCode, year])
        ).rows[0]?.birthday;

        if (!birthday) {
            const birthday = (
                await axios.post('http://localhost:2932/getBirthday', {name, schoolCode, year})
            ).data.birthday[0];

            await db.query(
                'INSERT INTO users (name, birthday, schoolCode, year) VALUES ($1, $2, $3, $4);',
                [name, birthday, schoolCode, year]
            );
            res.redirect(req.originalUrl);
        }

        const token = (
            await axios.post(
                'http://localhost:2932/getUserInfo',
                {
                    "name": name!.replace('A', '').replace('B', ''),
                    "birthday": birthday,
                    "schoolCode": schoolCode,
                }
            )
        ).data.token;

        const registerTime = (
            await axios.post(
                'http://localhost:2932/registerSurvey',
                {
                    "name": name!.replace('A', '').replace('B', ''),
                    "token": token,
                }
            )
        ).data.registerTime;

        res.send("<h1> SUCCESS! </h1>");
        return;
    })
);

export default router;
