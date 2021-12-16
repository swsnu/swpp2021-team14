import axios from "axios";
import * as actionCreators from './workoutActions'
import store from "../../store";

const workoutEntries = [];
const bodyInfo = [];
const voicePartner = [];
const workoutList = [];

describe('ActionCreaator for Workouts', ()=>{
    afterEach(()=>jest.clearAllMocks());

    it('should get workout correctly', (done)=>{
        const spyGet = jest.spyOn(axios, 'get').mockImplementation((url)=>{
            return new Promise(resolve => resolve({status:200, data: workoutEntries}))
        });

        store.dispatch(actionCreators.getWorkout(20211127));
        expect(spyGet).toBeCalledWith('/api/workout_detail/20211127/');
        done();
    });

    it('should get bodyInfo correctly', (done)=>{
        const spyGet = jest.spyOn(axios, 'get').mockImplementation((url)=>{
            return new Promise(resolve => resolve({status:200, data: bodyInfo}))
        });

        store.dispatch(actionCreators.getBodyInfo())
        expect(spyGet).toBeCalledWith('/api/body_info/');
        done();
    });

    it('should add body information correctly', (done)=>{
        const spyPut = jest.spyOn(axios, 'put').mockImplementation((url, data)=>{
            return new Promise(resolve => resolve({status:200, data: bodyInfo}))
        });

        const mockData = {date: 20211127}
        store.dispatch(actionCreators.addBodyInfo(mockData));
        expect(spyPut).toBeCalledWith('/api/workout_detail/20211127/', mockData);
        done();
    });

    it('should add workout correctly', (done)=>{
        const spyPost = jest.spyOn(axios, 'post').mockImplementation((url, data)=>{
            return new Promise(resolve => resolve({status:200, data: workoutEntries}))
        });

        store.dispatch(actionCreators.addWorkout(20211127, 0));
        expect(spyPost).toBeCalledWith('/api/workout_entry/', {date:20211127, id:0});
        done();
    });

    it('should delete workout correctly', (done)=>{
        const spyDelete = jest.spyOn(axios, 'delete').mockImplementation((url)=>{
            return new Promise(resolve => resolve({status:200, data: workoutEntries}))
        });

        store.dispatch(actionCreators.deleteWorkout(0));
        expect(spyDelete).toBeCalledWith('/api/workout_entry/0/');
        done();
    });

    it('should add set correctly', (done)=>{
        const spyPost = jest.spyOn(axios, 'post').mockImplementation((url, data)=>{
            return new Promise(resolve => resolve({status:200, data: workoutEntries}))
        });

        const mockData = {data:"mockData"}
        store.dispatch(actionCreators.addSet(mockData));
        expect(spyPost).toBeCalledWith('/api/workout_set/', mockData);
        done();
    });

    it('should edit set correctly', (done)=>{
        const spyPut = jest.spyOn(axios, 'put').mockImplementation((url, data)=>{
            return new Promise(resolve => resolve({status:200, data: bodyInfo}))
        });

        const mockData = {id: 0}
        store.dispatch(actionCreators.editSet(mockData));
        expect(spyPut).toBeCalledWith('/api/workout_set/0/', mockData);
        done();
    });

    it('should delete set correctly', (done)=>{
        const spyDelete = jest.spyOn(axios, 'delete').mockImplementation((url)=>{
            return new Promise(resolve => resolve({status:200, data: workoutEntries}))
        });

        store.dispatch(actionCreators.deleteSet(0));
        expect(spyDelete).toBeCalledWith('/api/workout_set/0/');
        done();
    });

    it('should start voice partner correctly', (done)=>{
        const spyGet = jest.spyOn(axios, 'get').mockImplementation(url=>{
            return new Promise(resolve=>resolve({status:200, data: voicePartner}))
        });

        store.dispatch(actionCreators.startVoicePartner(20211211));
        expect(spyGet).toBeCalledWith('/api/voice_partner/20211211/');
        done();
    });

    it('should check voice partner correctly', (done)=>{
        const spyPut = jest.spyOn(axios, 'put').mockImplementation(url=>{
            return new Promise(resolve=>resolve({status:200, data: workoutEntries}))
        });

        store.dispatch(actionCreators.checkVoicePartner(1));
        expect(spyPut).toBeCalledWith('/api/voice_partner/1/');
        done();
    });

    it('should get workout summary correctly', (done)=>{
        const spyPut = jest.spyOn(axios, 'put').mockImplementation(url=>{
            return new Promise(resolve=>resolve({status:200, data: workoutList}))
        });

        const dateList = [20211211, 20211212]
        store.dispatch(actionCreators.getWorkoutSummary(dateList));
        expect(spyPut).toBeCalledWith('/api/workout_summary/', dateList);
        done();
    });

});