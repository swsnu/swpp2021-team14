import * as actionTypes from '../../actions/actionTypes';

const initState = {exerciseList: null, muscleTypes: null, exerciseTypes: null}

export default function loginReducer(state = initState, action) {
    const {type, exerciseList} = action;
    switch (type) {
        case actionTypes.GET_EXERCISE_LIST: {
            let muscleTypes = []
            let exerciseTypes = []

            for (let entry of exerciseList) {
                let candidateMuscleType = entry['muscleType']
                if (!muscleTypes.includes(candidateMuscleType)) {
                    muscleTypes.push(candidateMuscleType);
                }
                let candidateExerciseType = entry['exerciseType']
                const candidate_entry = {
                    muscleType: candidateMuscleType,
                    exerciseType: candidateExerciseType
                }
                if (exerciseTypes.filter(entry => {
                    return entry['muscleType'] === candidateMuscleType && entry['exerciseType'] === candidateExerciseType
                }).length === 0) {
                    exerciseTypes.push(candidate_entry)
                }
            }

            return {...state, exerciseList, muscleTypes, exerciseTypes}

        }
        default:
            return state;
    }
}