import { Router } from 'express';
import axios from 'axios';

import { asyncHandler } from '../middlewares';

const router = Router();

const registerSurvey = async ({
    name,
    token
}: {
    name: string,
    token: string
}): Promise<string> => {
    const registerTime = (
        await axios.post(
            "https://goehcs.eduro.go.kr/registerServey",
            {
                "rspns00": "Y",
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
                "deviceUuid": "",
                "upperToken": token,
                "upperUserNameEncpt": name
            },
            {
                headers: {
                    "Authorization": token,
                },
            },
        )
    ).data.registerDtm;
    return registerTime;
};

router.post(
    '/',
    asyncHandler(async (req, res) => {
        const { name, token } = req.body;
        const registerTime = await registerSurvey({ name, token });
        res.json({ registerTime });
        return;
    }),
);

export default router;