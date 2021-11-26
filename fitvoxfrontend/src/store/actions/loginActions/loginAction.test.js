import axios from 'axios';
import * as actionCreators from './loginActions';
import store from "../../store";

describe('Test ActionCreators for Login', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should login correctly', (done) => {
        const spyAlert = jest.spyOn(window, 'alert').mockImplementation(()=>{return 0})
        const spyPost = jest.spyOn(axios, 'post').mockImplementation((url, data) => {
            return new Promise((resolve, reject) => {
                resolve({status:200})
            })
        })

        const mockData = {data:"mockData"};
        store.dispatch(actionCreators.getLogin(mockData));
        expect(spyPost).toBeCalledWith('/api/signin/', mockData);
        done();
    });

    it('should logout correctly', (done)=>{
        const spyGet = jest.spyOn(axios, 'get').mockImplementation((url) => {
            return new Promise((resolve, reject) => {
                resolve({status:200})
            });
        });

        store.dispatch(actionCreators.getLogout());
        expect(spyGet).toBeCalledWith('/api/signout/');
        done();
    })

    it('should maintain login correctly', (done)=>{
        const spyGet = jest.spyOn(axios, 'get').mockImplementation((url) => {
            return new Promise((resolve, reject) => {
                resolve({status:200, data:{authenticated:true}})
            });
        });

        store.dispatch(actionCreators.maintainLogin());
        expect(spyGet).toBeCalledWith('/api/isAuth/');
        done();
    })

    it('should maintain logout correctly', (done)=>{
        const spyGet = jest.spyOn(axios, 'get').mockImplementation((url) => {
            return new Promise((resolve, reject) => {
                resolve({status:200, data:{authenticated:false}})
            });
        });

        store.dispatch(actionCreators.maintainLogin());
        expect(spyGet).toBeCalledWith('/api/isAuth/');
        done();
    })

    it('should create account successfully', (done)=>{
        const spyAlert = jest.spyOn(window, 'alert').mockImplementation(()=>{return 0})
        const spyPost = jest.spyOn(axios, 'post').mockImplementation((url, data) => {
            return new Promise((resolve, reject) => {
                resolve({status:200})
            })
        })

        const mockData = {data:"mockData"};
        store.dispatch(actionCreators.createAccount(mockData));
        expect(spyPost).toBeCalledWith('/api/signup/', mockData);
        done();
    })

    it('should handle when create account failed', (done)=>{
        const spyAlert = jest.spyOn(window, 'alert').mockImplementation(()=>{return 0})
        const spyPost = jest.spyOn(axios, 'post').mockImplementation((url, data) => {
            return new Promise((resolve, reject) => {
                reject({status:200})
            })
        })

        const mockData = {data:"mockData"};
        store.dispatch(actionCreators.createAccount(mockData));
        expect(spyPost).toBeCalledWith('/api/signup/', mockData);
        done();
    })





});