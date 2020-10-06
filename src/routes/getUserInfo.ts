import { Router } from 'express';
import axios from 'axios';

import { asyncHandler } from '../middlewares';
import { encryptor } from '../utils';

import { UserInfo } from '../interfaces';

const router = Router();

const getUserInfo = async ({
    name,
    birthday,
    schoolCode
}: {
    name: string,
    birthday: string,
    schoolCode: string
}): Promise<UserInfo> => {
        const userInfo: UserInfo = (
            await axios.post(
                'https://goehcs.eduro.go.kr/v2/findUser',
                {
                    "orgCode": schoolCode,
                    "name": encryptor.encrypt(name),
                    "birthday": encryptor.encrypt(birthday),
                    "stdntPNo": null,
                    "loginType": "school",
                },
            )
        ).data;
        return userInfo;
};

router.post(
    '/',
    asyncHandler(async (req, res) => {
        const { name, birthday, schoolCode } = req.body;
        const userInfo = await getUserInfo({name, birthday, schoolCode});
        res.json(userInfo);
        return;
    }),
);

export default router;