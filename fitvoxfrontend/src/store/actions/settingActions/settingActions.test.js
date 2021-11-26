import axios from "axios";
import * as actionCreators from './settingActions'
import store from "../../store";

describe('ActionCreator for Setting', () => {
    afterEach(() => jest.clearAllMocks());

    const mockData = {hardness: 1, breaktime: 60}

    it('should get setting correctly', (done) => {
        const spyGet = jest.spyOn(axios, 'get').mockImplementation((url) => {
            return new Promise(resolve => {
                resolve({status: 200, data: mockData})
            })
        });

        store.dispatch(actionCreators.getSetting());
        expect(spyGet).toBeCalledWith('/api/psetting/')
        done();
    })

    it('should change setting correctly', (done) => {
        const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {
            return 0
        })
        const spyPut = jest.spyOn(axios, 'put').mockImplementation((url, data) => {
            return new Promise(resolve => {
                resolve({status: 200, data: mockData})
            })
        });

        const mockData = {data: "mockData"};
        store.dispatch(actionCreators.changeSetting(mockData));
        expect(spyPut).toBeCalledWith('/api/psetting/', mockData)
        done();
    })

    it('should handle when change setting failed', (done) => {
        const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {
            return 0
        })
        const spyPut = jest.spyOn(axios, 'put').mockImplementation((url, data) => {
            return new Promise((resolve, reject) => {
                reject({status: 200, data: mockData})
            })
        });

        const mockData = {data: "mockData"};
        store.dispatch(actionCreators.changeSetting(mockData));
        expect(spyPut).toBeCalledTimes(1);
        expect(spyAlert).toBeCalledTimes(0);
        done();
    })

})
