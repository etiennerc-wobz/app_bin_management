// api.test.js

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const api = require('../api');
import {getBins, getTraps, setAuthToken, login, openTrap} from '../api';

const mock = new MockAdapter(axios);

describe('API Functions with Authentication', () => {
    let validToken;

    beforeAll(async () => {
        // Mock the login API to return a valid token for correct credentials
        const loginResponse = {
            token: 'valid-token',
            user: {id: 1, username: 'greg', festival: 'some-festival'}
        };

        mock.onPost('/api/login').reply(200, loginResponse);

        // Simulate logging in with valid credentials to get the token
        const data = await login('greg', 'azer');
        validToken = data.token;
        setAuthToken(validToken);  // Set the token in Axios
    });

    afterEach(() => {
        mock.reset(); // Reset the mock adapter after each test
    });

    test('fetches bins successfully with valid token', async () => {
        const bins = [{id: 1, name: 'Bin 1'}, {id: 2, name: 'Bin 2'}];

        // Mock the GET request to /api/bins for authenticated requests
        mock.onGet('/api/bins').reply(config => {
            // Simulate authenticated request
            if (config.headers['Authorization'] === `Bearer ${validToken}`) {
                return [200, bins];
            }
            return [401, 'Unauthorized']; // Fallback for other cases
        });

        // Call the function
        const data = await getBins();

        // Verify that the response is an array
        expect(Array.isArray(data)).toBe(true);

        // Verify that each element in the array is an object
        data.forEach(item => {
            expect(typeof item).toBe('object');
        });
    });

    test('fetch traps successfully with valid token', async () => {
        const traps = [{id: 1, name: 'Trap 1'}, {id: 2, name: 'Trap 2'}];

        // Mock the GET request to /api/traps for authenticated requests
        mock.onGet('/api/traps').reply(config => {
            // Simulate authenticated request
            if (config.headers['Authorization'] === `Bearer ${validToken}`) {
                return [200, traps];
            }
            return [401, 'Unauthorized']; // Fallback for other cases
        });

        // Call the function
        const data = await getTraps();

        // Verify that the response is an array
        expect(Array.isArray(data)).toBe(true);

        // Verify that each element in the array is an object
        data.forEach(item => {
            expect(typeof item).toBe('object');
        });
    });

    test('open trap state with valid token', async () => {
        const trapId = 1;
        const responseMessage = {mode: 'open'};

        // Mock the POST request to /api/opentrap for authenticated requests
        mock.onPost('/api/opentrap').reply(config => {
            // Simulate authenticated request
            if (config.headers['Authorization'] === `Bearer ${validToken}`) {
                return [200, responseMessage];
            }
            return [401, 'Unauthorized']; // Fallback for other cases
        });

        // Call the function
        const data = await openTrap(trapId);
        expect(data.mode).toBe('open');
    });

    test('fetch bins fails with invalid token', async () => {
            // Mock the GET request to /api/bins for authenticated requests
            mock.onGet('/api/bins').reply(401, 'Unauthorized');

            // Call the function
            try {
                await getBins();
            } catch (error) {
                expect(error.response.status).toBe(401);
            }
        }
    );

    test('logging in with invalid credentials', async () => {
        // Mock the login API to return an error for incorrect credentials
        mock.onPost('/api/login').reply(401, 'Unauthorized');

        // Call the function
        try {
            await login('invalid', 'credentials');
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });


})
;