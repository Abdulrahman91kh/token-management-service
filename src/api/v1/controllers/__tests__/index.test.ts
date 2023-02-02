import { generateTokens, getTokenStatus, redeemToken } from "..";
import * as tokenServices from '../../services';

describe('Testing Controller File', () => {
    it('Should test generateTokens calling services and return formatted response', async () => {
        const mockCount = "2" as any;
        const mockGenerateTokens = jest.spyOn(tokenServices, 'generateTokens').mockReturnValueOnce({tokens: [{id: 'testing-id'}], ids: ['testing-id']} as any);
        const mockSaveTokens = jest.spyOn(tokenServices, 'saveTokens').mockReturnValueOnce([Promise.resolve()] as any);
        const results = await generateTokens(mockCount);
        expect(mockGenerateTokens).toBeCalledWith("2");
        expect(mockSaveTokens).toBeCalledWith([{id: 'testing-id'}]);
        expect(typeof results.created).toBe('string');
        expect(results.token).toEqual(expect.arrayContaining(['testing-id']));
    });
    it('Should test getTokenStatus calling services and return available', async () => {
        const mockId = 'Testing-id';
        const mockToken = {status: 'available'};
        const mockGetToken = jest.spyOn(tokenServices, 'getToken').mockResolvedValueOnce(mockToken as any);
        const mockCheckValidity = jest.spyOn(tokenServices, 'checkValidToken').mockReturnValueOnce(true);
        const mockExpiryDate = jest.spyOn(tokenServices, 'expireTokens').mockResolvedValueOnce(false);
        const result = await getTokenStatus(mockId);
        expect(result.status).toBe('available');
        expect(mockGetToken).toBeCalledWith('Testing-id');
        expect(mockCheckValidity).toBeCalledWith(mockToken);
        expect(mockExpiryDate).toBeCalledWith(mockToken, true);
    });
    it('Should test getTokenStatus calling services and return expired by date', async () => {
        const mockId = 'Testing-id';
        const mockToken = {status: 'available'};
        const mockGetToken = jest.spyOn(tokenServices, 'getToken').mockResolvedValueOnce(mockToken as any);
        const mockCheckValidity = jest.spyOn(tokenServices, 'checkValidToken').mockReturnValueOnce(true);
        const mockExpiryDate = jest.spyOn(tokenServices, 'expireTokens').mockResolvedValueOnce(true);
        const result = await getTokenStatus(mockId);
        expect(result.status).toBe('expired');
        expect(mockGetToken).toBeCalledWith('Testing-id');
        expect(mockCheckValidity).toBeCalledWith(mockToken);
        expect(mockExpiryDate).toBeCalledWith(mockToken, true);
    });
    it('Should test getTokenStatus calling services and return expired by validity', async () => {
        const mockId = 'Testing-id';
        const mockToken = {status: 'expired'};
        const mockGetToken = jest.spyOn(tokenServices, 'getToken').mockResolvedValueOnce(mockToken as any);
        const mockCheckValidity = jest.spyOn(tokenServices, 'checkValidToken').mockReturnValueOnce(false);
        const mockExpiryDate = jest.spyOn(tokenServices, 'expireTokens').mockResolvedValueOnce(false);
        const result = await getTokenStatus(mockId);
        expect(result.status).toBe('expired');
        expect(mockGetToken).toBeCalledWith('Testing-id');
        expect(mockCheckValidity).toBeCalledWith(mockToken);
        expect(mockExpiryDate).toBeCalledWith(mockToken, false);
    });

    it('Should test redeemToken calling services and return ok', async () => {
        const mockId = 'Testing-id';
        const mockToken = {status: 'available'};
        const mockGetToken = jest.spyOn(tokenServices, 'getToken').mockResolvedValueOnce(mockToken as any);
        const mockCheckValidity = jest.spyOn(tokenServices, 'checkValidToken').mockReturnValueOnce(true);
        const mockExpiryDate = jest.spyOn(tokenServices, 'expireTokens').mockResolvedValueOnce(false);
        const mockRedeemToken = jest.spyOn(tokenServices, 'redeemToken').mockResolvedValueOnce({} as any);
        const result = await redeemToken(mockId);
        expect(result.result).toBe('ok');
        expect(mockGetToken).toBeCalledWith('Testing-id');
        expect(mockCheckValidity).toBeCalledWith(mockToken);
        expect(mockExpiryDate).toBeCalledWith(mockToken, true);
        expect(mockRedeemToken).toBeCalledWith(mockToken, false);
    });

    
});