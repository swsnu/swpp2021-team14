import axios from "axios";
import * as actionCreators from './exerciselistActions'
import store from "../../store";

const exerciseList = []

describe('ActionCreator for Exercise', () => {
    afterEach(() => jest.clearAllMocks());

    it('should get exercise list correctly', (done) => {
        const spyGet = jest.spyOn(axios, 'get').mockImplementation((url) => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200,
                    data: exerciseList
                }
                resolve(result)
            })
        })

        store.dispatch(actionCreators.getExerciseList())
        expect(spyGet).toHaveBeenCalledTimes(1)
        done()
    })

    it('should add exercise correctly', (done) => {

        const data = {data: "mock data"}

        const spyPost = jest.spyOn(axios, 'post').mockImplementation((url, data) => {
            return new Promise((resolve, reject) => {
                const result = {
                    status: 200
                }
                resolve(result)
            })
        })

        store.dispatch(actionCreators.addExercise(data));
        expect(spyPost).toBeCalledWith('/api/exercise_list/', data);
        done();
    })

    it('should change tag and check favorite correctly', (done) => {
        const spyPut = jest.spyOn(axios, 'put').mockImplementation((url, data) => {
            return new Promise(resolve => {
                resolve({status: 200, data: exerciseList})
            })
        })
        const favorite = {favorite: true}
        const tags = {tags:"mock tags"}
        store.dispatch(actionCreators.checkFavorite(favorite));
        expect(spyPut).toBeCalledWith('/api/exercise_list/', favorite);

        store.dispatch(actionCreators.changeTags(tags));
        expect(spyPut).toBeCalledWith('/api/exercise_list/', tags);
        done();
    })

});