import { checkValidToken, expireTokens, generateTokens, getToken, redeemToken, saveTokens } from "..";
import CustomError from "../../config/custom-error";
import * as helpers from '../utils';
import * as redisHandlers from '../../storage/redis';

describe('Testing Services index file', () => {
    it('Should call GenerateTokens and throw an invalid count error', () => {
        const mockCount = 'WrongValue';
        expect(() => generateTokens(mockCount)).toThrowError(CustomError);
        expect(() => generateTokens(mockCount)).toThrowError('Not valid tokens count in the query string "?tokens=<NUMERIC_VALUE>"');
    });
    it('Should call GenerateTokens successfully', () => {
        const mockCount = '2';
        const mockGenerateToken = jest.spyOn(helpers, 'generateToken').mockReturnValue({id: 'test'} as any);
        const results = generateTokens(mockCount)
        expect(mockGenerateToken).toBeCalledTimes(2);
        expect(results).toMatchObject({
            tokens: [
                {
                    id: 'test',
                },
                {
                    id: 'test'
                }
            ],
            ids: [
                'test', 'test'
            ]
        });
    });

    it('Should test saveTokens passing parameters to the insert function', async () => {
        const mockTokens = ['This is my list of tokens'] as any;
        const mockInsertTokens = jest.spyOn(redisHandlers, 'insertToken').mockResolvedValueOnce(0);
        await saveTokens(mockTokens);
        expect(mockInsertTokens).toBeCalledWith('This is my list of tokens');
        expect(mockInsertTokens).toBeCalledTimes(mockTokens.length);
    });

    it('Should test getToken service, it should throw 404 error', () => {
        const mockRetrieveToken = jest.spyOn(redisHandlers, 'retrieveToken').mockResolvedValue({});
        expect(getToken('test')).rejects.toThrowError(CustomError);
        expect(getToken('test')).rejects.toThrowError('Token is not found');
        expect(mockRetrieveToken).toBeCalled();
    });

    it('Should test getToken service the happy path', async () => {
        const mockRetrieveToken = jest.spyOn(redisHandlers, 'retrieveToken').mockResolvedValue({ status: 'yaay', createdAt: 1} as any);
        const results = await getToken('test');
        expect(mockRetrieveToken).toBeCalled();
        expect(results.createdAt).toBe(1);
        expect(results.status).toBe('yaay');
        expect(results.id).toBe('test');
    });

    it('Should test checkValidToken return false not available', () => {
        const mockCheckAvailable = jest.spyOn(helpers, 'checkIsAvailable').mockReturnValueOnce(false);
        const result = checkValidToken('test' as any);
        expect(result).toBe(false);
        expect(mockCheckAvailable).toBeCalledWith('test');
    });
    it('Should test checkValidToken return false expired', () => {
        const mockToken = {
            createdAt: 5
        };
        const mockCheckAvailable = jest.spyOn(helpers, 'checkIsAvailable').mockReturnValueOnce(true);
        const mockCheckDate = jest.spyOn(helpers, 'checkIsTokenExpired').mockReturnValueOnce(true);
        process.env.TTL_IN_DAYS = "10";
        const result = checkValidToken(mockToken as any);
        expect(result).toBe(false);
        expect(mockCheckAvailable).toBeCalledWith(mockToken);
        expect(mockCheckDate).toBeCalledWith(5, 10);
    });
    it('Should test checkValidToken return true', () => {
        const mockToken = {
            createdAt: 5
        };
        const mockCheckAvailable = jest.spyOn(helpers, 'checkIsAvailable').mockReturnValueOnce(true);
        const mockCheckDate = jest.spyOn(helpers, 'checkIsTokenExpired').mockReturnValueOnce(false);
        process.env.TTL_IN_DAYS = "10";
        const result = checkValidToken(mockToken as any);
        expect(result).toBe(true);
        expect(mockCheckAvailable).toBeCalledWith(mockToken);
        expect(mockCheckDate).toBeCalledWith(5, 10);
    });

    it('Should test expireToken should return false already expired', async () => {
        const mockToken = {
            status: 'expired',
        };
        const result = await expireTokens(mockToken as any, false);
        expect(result).toBe(false);
    });

    it('Should test expireToken should return false is valid', async () => {
        const mockToken = {
            status: 'available',
        };
        const result = await expireTokens(mockToken as any, true);
        expect(result).toBe(false);
    });

    it('Should test expireToken should return true and update token', async () => {
        const mockToken = {
            status: 'available',
        };
        const mockUpdateToken = jest.spyOn(redisHandlers, 'updateTokenStatus').mockResolvedValueOnce({} as any);
        const result = await expireTokens(mockToken as any, false);
        expect(result).toBe(true);
        expect(mockUpdateToken).toBeCalledWith(mockToken as any, 'expired');
    });

    it('Should test redeemToken throw an error expired Token via status', () => {
        const mockToken = {
            status: 'expired'
        };
        expect(redeemToken(mockToken as any, false)).rejects.toThrowError(CustomError);
        expect(redeemToken(mockToken as any, false)).rejects.toThrowError('Cannot redeem this token as it is already expired');
    });
    it('Should test redeemToken throw an error expired Token via parameter', () => {
        const mockToken = {
            status: 'available'
        };
        expect(redeemToken(mockToken as any, true)).rejects.toThrowError(CustomError);
        expect(redeemToken(mockToken as any, true)).rejects.toThrowError('Cannot redeem this token as it is already expired');
    });
    it('Should test redeemToken throw an error redeemed Token', () => {
        const mockToken = {
            status: 'redeemed'
        };
        expect(redeemToken(mockToken as any, false)).rejects.toThrowError(CustomError);
        expect(redeemToken(mockToken as any, false)).rejects.toThrowError('Cannot redeem this token as it is already redeemed');
    });
    it('Should test redeemToken would call updateTokenStatus', async () => {
        const mockToken = {
            status: 'available'
        };
        const mockUpdateToken = jest.spyOn(redisHandlers, 'updateTokenStatus').mockResolvedValueOnce({} as any);
        await redeemToken(mockToken as any, false);
        expect(mockUpdateToken).toBeCalledWith(mockToken, 'redeemed');
    });

});