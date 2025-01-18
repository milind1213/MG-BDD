require('dotenv').config({ path: './config-directory/.env' });

class CommonConstants {
    // Environment Variables
    static PROD_WEB_URL = process.env.prod_Url;
    static BASE_URL_1 = process.env.base_URL1;
    static BASE_URL_2 = process.env.base_URL2;
    static BASE_URL_3 = process.env.base_URL3;
    static GOREST_TOKEN = process.env.token;
    static BROWSER_TYPE = process.env.browser_Name;
    static IS_HEADLESS = process.env.isHeadless === 'true';
    static IS_REMOTE = process.env.isRemote === 'true';
    static SEND_SLACK_REPORT = process.env.send_Slack_Report === 'true';
    static SLACK_TOKEN = process.env.slackToken;
    static SLACK_CHANNEL_ID = process.env.slack_Channel_ID;
    static REPORT_HEADER = process.env.report_Header;
    static LT_USER_NAME = process.env.lambdaTest_UserName;
    static LT_ACCESS_KEY = process.env.lambdatest_AccessKey;
    static TEST_FLATFORM = process.env.lambdatest_Testing_Platform;
    static BROWSER_VERSION = process.env.browser_Version;
    static BUILD_NAME = process.env.build_Name;
    static TEST_NAME = process.env.test_Name;
    static JIRA_BASE_URL = process.env.jira_baseUrl;
    static JIRA_API_URL = process.env.jira_ApiUrl;
    static JIRA_EMAIL = process.env.jira_Email;
    static JIRA_PROJECT_KEY = process.env.jira_Project_Key;
    static JIRA_API_TOKEN = process.env.jira_Api_Token;
    static PROJECT_NAME = 'DEMO PROJECT';

   // Constants
    static CarModels = {
        POLESTAR_2: 'Polestar 2',
        POLESTAR_3: 'Polestar 3',
        POLESTAR_4: 'Polestar 4',
        POLESTAR_5: 'Polestar 5',
        POLESTAR_6: 'Polestar 6',
    };

    static CarColors = {
        SNOW: 'Snow',
        SPACE: 'Space',
        MIDNIGHT: 'Midnight',
        THUNDER: 'Thunder',
        MAGNESIUM: 'Magnesium',
        JUPITER: 'Jupiter',
    };

    static Model = {
        LAUNCH_EDITION: 'Launch edition',
    };

    static Interior = {
        CHARCOAL_NAPPA_LEATHER: 'Charcoal Nappa leather',
        JUPITER_NAPPA_LEATHER: 'Jupiter Nappa leather',
        ZINC_NAPPA_LEATHER: 'Zinc Nappa leather',
        CHARCOAL_WEAVETECH: 'Charcoal WeaveTech',
        WOOL: 'Wool',
        MICROTECH: 'MicroTech',
    };

    static CarVersion = {
        LONG_RANGE_DUAL_MOTOR_WITH_PERFORMANCE: 'Long range Dual motor with Performance pack',
        LONG_RANGE_DUAL_MOTOR: 'Long range Dual motor',
    };

    static Packs = {
        PERFORMANCE: 'Performance',
        PRO: 'Pro',
        PILOT: 'Pilot',
        PLUS: 'Plus',
    };

    static Wheels = {
        PERFORMANCE: '22" Performance',
        SPORT: '22" Sport',
        PRO: '21" Pro',
        PLUS: '21" Plus',
        AERO: '20" Aero',
    };

    // Utility Methods
    static generateRandomEmail(length) {
        const randomText = this.generateRandomText(length);
        return `${randomText}@example.com`;
    }

    static generateRandomPincode() {
        const pincode = Math.floor(100000 + Math.random() * 900000);
        return pincode.toString();
    }

    static getRandomNumberInRange(min, max) {
        if (min >= max) {
            throw new Error('max must be greater than min');
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static generateRandomTextFromAscii(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomCharCode = Math.floor(Math.random() * 94) + 33;
            result += String.fromCharCode(randomCharCode);
        }
        return result;
    }

    static generateRandomText(length) {
        let result = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }
        return result;
    }

    static checkOrder(array) {
        if (array.every((val, i, arr) => i === 0 || arr[i - 1] <= val)) {
            return 'ascending';
        } else if (array.every((val, i, arr) => i === 0 || arr[i - 1] >= val)) {
            return 'descending';
        } else {
            return 'not sorted';
        }
    }
}

Object.freeze(CommonConstants);
module.exports = CommonConstants;
