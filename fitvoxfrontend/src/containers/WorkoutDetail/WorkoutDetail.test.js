import React from "react";
import {mount} from 'enzyme';
import WorkoutDetail from "./WorkoutDetail";
import {Provider} from 'react-redux';
import * as actionCreators from '../../store/actions/workoutActions/workoutActions'
import {getMockStore} from "../../test-utils/mocks";
import {createMemoryHistory} from "history";
import * as actionTypes from "../../store/actions/actionTypes"
import {Route, Router} from 'react-router-dom'
import AudioPlayer from "react-h5-audio-player";

const stubInitialState = {
    exercise: {
        exerciseList: [
            {id: 0, name: "Bench Press"}
        ]
    },
    workout: {
        workoutList: [],
        workoutEntries: [
            {
                id: 0,
                exercise_id: 0,
                sets: [{id: 0, repetition: 10, weight: 12, breaktime: 90}]
            },
            {
                id: 1,
                exercise_id: 0,
                sets: [{id: 1, repetition: 10, weight: 12, breaktime: 90}]
            }
        ],
        voicePartner: []

    },
    setting: {
        minute: 1,
        second: 30
    },
    statistics:{
        bodyInfo:[]
    }
};

const stubInitialStateWithBodyInfo = {
    exercise: {
        exerciseList: [
            {id: 0, name: "Bench Press"}
        ]
    },
    workout: {
        workoutList: [],
        workoutEntries: [
            {
                id: 0,
                exercise_id: 0,
                sets: [{id: 0, repetition: 10, weight: 12, breaktime: 90}]
            }
        ],
        voicePartner: []
    },
    setting: {
        minute: 1,
        second: 30
    },
    statistics:{
        bodyInfo:[{date:20211127, bodyWeight: 10, bodyFat: 10, skeletalMuscle: 10}]
    }
};

const stubInitialStateWithVoicePartner1 = {
    exercise: {
        exerciseList: [
            {id: 0, name: "Bench Press"}
        ]
    },
    workout: {
        workoutList: [],
        workoutEntries: [
            {
                id: 0,
                exercise_id: 0,
                sets: [{id: 0, repetition: 10, weight: 12, breaktime: 90}],
                isVoicePartner: true
            },
            {
                id: 1,
                exercise_id: 0,
                sets: [{id: 1, repetition: 10, weight: 12, breaktime: 90}],
                isVoicePartner: true
            }
        ],
        voicePartner: []

    },
    setting: {
        minute: 1,
        second: 30
    },
    statistics:{
        bodyInfo:[]
    }
};

const stubInitialStateWithVoicePartner2 = {
    exercise: {
        exerciseList: [
            {id: 0, name: "Bench Press"}
        ]
    },
    workout: {
        workoutList: [],
        workoutEntries: [
            {
                id: 0,
                exercise_id: 0,
                sets: [{id: 0, repetition: 10, weight: 12, breaktime: 90}],
                isVoicePartner: true
            },
            {
                id: 1,
                exercise_id: 0,
                sets: [{id: 1, repetition: 10, weight: 12, breaktime: 90}],
                isVoicePartner: true
            }
        ],
        voicePartner: [{id: 0, url:"", message:""}]

    },
    setting: {
        minute: 1,
        second: 30
    },
    statistics:{
        bodyInfo:[]
    }
};


const store = getMockStore(stubInitialState);
const storeWithBodyInfo = getMockStore(stubInitialStateWithBodyInfo);
const storeWithVoicePartner1 = getMockStore(stubInitialStateWithVoicePartner1);
const storeWithVoicePartner2 = getMockStore(stubInitialStateWithVoicePartner2);
jest.mock('../WorkoutEntry/WorkoutEntry', () => (props) => <div>Workout Entry</div>);
jest.mock('../Menu/Menu', ()=>(props)=><div>Menu</div>)

describe("Test <Workout Detail/>", ()=>{
    let history, workoutDetail;
    let spyOnGetWorkout, spyOnGetBodyInfo;

    beforeEach(() => {
        history = createMemoryHistory({initialEntries:['/20211127']})
        workoutDetail = (
            <Provider store={store}>
                <Router history={history}>
                    <Route path="/:date" component={WorkoutDetail} />
                </Router>
            </Provider>
        )

        spyOnGetWorkout = jest.spyOn(actionCreators, 'getWorkout').mockImplementation((data)=>{
            return {type: actionTypes.GET_WORKOUT_ENTRIES, workoutEntries: []};
        });

        spyOnGetBodyInfo = jest.spyOn(actionCreators, 'getBodyInfo').mockImplementation((data)=>{
            return {type: actionTypes.GET_BODY_INFO, bodyInfo: []};
        });
    });

    afterEach(()=>jest.clearAllMocks());

    it('should render without error', ()=>{
        const wrapper = mount(workoutDetail);
        expect(wrapper.find(".WorkoutDetail").length).toBe(1);
    });

    it('should componentDidMount work properly', ()=>{
        const wrapper = mount(workoutDetail);
        expect(spyOnGetWorkout).toBeCalledWith('20211127');
        expect(spyOnGetBodyInfo).toBeCalledTimes(1);
    });

    it('should read body info of the day correctly if it exists', ()=>{
        const history = createMemoryHistory({initialEntries:['/20211127']})
        const workoutDetail = (
            <Provider store={storeWithBodyInfo}>
                <Router history={history}>
                    <Route path="/:date" component={WorkoutDetail} />
                </Router>
            </Provider>
        );

        const wrapper = mount(workoutDetail);
        const instance = wrapper.find(WorkoutDetail.WrappedComponent).instance();
        expect(instance.state.bodyWeight).toBe(10);
        expect(instance.state.bodyFat).toBe(10);
        expect(instance.state.skeletalMuscle).toBe(10);
    });

    it('should add workout properly', ()=>{
        const spyPush = jest.spyOn(history, 'push');
        const wrapper = mount(workoutDetail);
        const addButton = wrapper.find('#add-workout-button').at(0);
        addButton.simulate('click');
        expect(spyPush).toBeCalledWith('/workout/20211127/add');
    })

    it('should edit body info properly', ()=>{
        const wrapper = mount(workoutDetail);
        const button = wrapper.find('#edit-body-info-button').at(0);
        button.simulate('click');

        const spyAddBodyInfo = jest.spyOn(actionCreators, 'addBodyInfo').mockImplementation((data)=>{
            return {type: actionTypes.GET_BODY_INFO, bodyInfo: []};
        });

        const weightInput = wrapper.find('#bodyWeight-input');
        weightInput.simulate('change', {target:{value:70}});
        const repInput = wrapper.find('#smm-input');
        repInput.simulate('change', {target:{value:35}});
        const minInput = wrapper.find('#bodyFat-input');
        minInput.simulate('change', {target:{value:15}});

        const confirmButton = wrapper.find("#confirm-body-info-button").at(0);
        confirmButton.simulate('click')

        expect(spyAddBodyInfo).toBeCalledWith({date:"20211127", bodyWeight:70, skeletalMuscle:35, bodyFat:15})
    })

    it('should comeback from edit mode for body info properly', ()=> {
        const wrapper = mount(workoutDetail);
        const button = wrapper.find('#edit-body-info-button').at(0);
        button.simulate('click');
        button.simulate('click');
        expect(wrapper.find("input").length).toBe(0);
    });

    it('should alert wrong input for editing body info', ()=>{
        const wrapper = mount(workoutDetail);
        const button = wrapper.find('#edit-body-info-button').at(0);
        button.simulate('click');

        const spyAlert = jest.spyOn(window, 'alert').mockImplementation(()=>{return 0})
        const spyAddBodyInfo = jest.spyOn(actionCreators, 'addBodyInfo').mockImplementation((data)=>{
            return {type: actionTypes.GET_BODY_INFO, bodyInfo: []};
        });

        const weightInput = wrapper.find('#bodyWeight-input');
        weightInput.simulate('change', {target:{value:-1}});
        const repInput = wrapper.find('#smm-input');
        repInput.simulate('change', {target:{value:-1}});
        const minInput = wrapper.find('#bodyFat-input');
        minInput.simulate('change', {target:{value:-1}});

        const confirmButton = wrapper.find("#confirm-body-info-button").at(0);
        confirmButton.simulate('click');
        expect(spyAlert).toBeCalledWith("Wrong Input! Input number should be larger than 0");
    })

    it('should not start voice partner when no entry is selected', ()=>{
        const wrapper = mount(workoutDetail);
        const spyAlert = jest.spyOn(window, 'alert').mockImplementation(()=>{return 0})
        const button = wrapper.find('#voice-partner-button').at(0);
        button.simulate('click');

        expect(spyAlert).toBeCalledWith("Should check at least one exercise with more than one sets");
    });

    it('should start voice partner when the entries are selected', ()=>{
        const workoutDetail = (
            <Provider store={storeWithVoicePartner1}>
                <Router history={history}>
                    <Route path="/:date" component={WorkoutDetail} />
                </Router>
            </Provider>
        );
        const spyOnStartVoicePartner = jest.spyOn(actionCreators, "startVoicePartner").mockImplementation(date=>{
            return {type: actionTypes.START_VOICE_PARTNER, voicePartner:[]} ;
        });
        const wrapper = mount(workoutDetail);
        const button = wrapper.find('#voice-partner-button').at(0);
        button.simulate('click');
        expect(spyOnStartVoicePartner).toBeCalledWith("20211127")
    })

    it('should end voice partner', ()=>{
        const workoutDetail = (
            <Provider store={storeWithVoicePartner2}>
                <Router history={history}>
                    <Route path="/:date" component={WorkoutDetail} />
                </Router>
            </Provider>
        );
        const wrapper = mount(workoutDetail);
        const player = wrapper.find(AudioPlayer);
        expect(player.length).toBe(1);
    })
})