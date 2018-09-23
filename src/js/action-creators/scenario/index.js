import * as scenarioActionTypes from '../../action-types/scenario';
import filterScenarios from '../../data/scenarios';

export function getScenario(name) {
  return {
    type: scenarioActionTypes.GET_SCENARIO,
    scenario: filterScenarios(name)
  };
}

export function modifyScenarioProperty(...args) {
  return dispatch => {
    args.forEach(arg =>
      dispatch({
        type: scenarioActionTypes.MODIFY_SCENARIO_PROPERTY,
        payload: { key: arg.key, value: arg.value }
      })
    );
  };
}

export function modifyMassProperty(payload) {
  return {
    type: scenarioActionTypes.MODIFY_MASS_PROPERTY,
    payload: {
      name: payload.name,
      key: payload.key,
      value: payload.value
    }
  };
}

export function deleteMass(name) {
  return {
    type: scenarioActionTypes.DELETE_MASS,
    name
  };
}
