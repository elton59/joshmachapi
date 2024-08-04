const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = '670863847595-hadrs56b4hed46lh5qnn76unkn6b13v4.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost';
const CODE = '4/0ATx3LY4QWIcUiEosW-5QoMxBFJqu-sr00-Y0ROQHA1Aa3rF-zfREJmg8-UNI2H_MEhhj4Q';

async function getTokensFromCode() {
    const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

    try {
        const { tokens } = await oAuth2Client.getToken(CODE);
        console.log('Access Token:', tokens.access_token);
        console.log('Refresh Token:', tokens.refresh_token);
    } catch (error) {
        console.error('Error fetching tokens:', error.message);
    }
}

getTokensFromCode();
