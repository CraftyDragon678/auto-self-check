import { Express } from 'express';

import getBirthday from './getBirthday';
import getSchoolInfo from './getSchoolInfo';
import getUserInfo from './getUserInfo';
import registerSurvey from './registerSurvey';

import selfCheck from './selfCheck';

export default (app: Express) => {
    app.use('/getBirthday', getBirthday);
    app.use('/getSchoolInfo', getSchoolInfo);
    app.use('/getUserInfo', getUserInfo);
    app.use('/registerSurvey', registerSurvey);
    
    app.use('/selfCheck', selfCheck);
};