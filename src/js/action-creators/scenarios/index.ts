import { AppState } from '../../reducers';
import {
  ScenariosActionTypes,
  ADD_SCENARIO
} from '../../action-types/scenarios';
import { AppActionTypes } from '../../action-types/app';
import { boot, setLoading } from '../../action-creators/app';
import { Action, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import cachedFetch from '../../cachedFetch';
import { scenarioDefaults } from '../../data/scenarios/defaults';

export const addScenario = (payload: {
  [x: string]: any;
}): ScenariosActionTypes => ({
  type: ADD_SCENARIO,
  payload
});

export const saveScenario = (
  payload: string
): ThunkAction<void, AppState, void, Action> => (
  dispatch: Dispatch<ScenariosActionTypes>,
  getState: any
) => {
  const scenario = getState().scenario;

  const scenarioToSave: any = {
    ...scenario,
    name: payload,
    type: 'Saved Simulations',
    playing: false,
    isLoaded: false
  };

  const savedScenarios = JSON.parse(localStorage.getItem('scenarios'));

  localStorage.setItem(
    'scenarios',
    JSON.stringify([
      ...(Array.isArray(savedScenarios) ? savedScenarios : []),
      scenarioToSave
    ])
  );

  dispatch(addScenario(scenarioToSave));
};

export const fetchExoplanetArchiveScenarios = (
  payload: any
): ThunkAction<void, AppState, void, Action> => async (
  dispatch: Dispatch<ScenariosActionTypes | AppActionTypes>
) => {
  dispatch(
    setLoading({
      loading: true,
      whatIsLoading: 'Loading not one world, but thousands'
    })
  );

  for (let entry of payload) {
    const data: any[] = await cachedFetch(
      `https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=exoplanets&select=pl_hostname&where=pl_facility like '${
        entry.name
      }'&format=json`
    );

    data.forEach((scenario: any) =>
      dispatch(
        addScenario({
          ...scenarioDefaults,
          name: scenario.pl_hostname,
          type: entry.alias,
          elementsToVectors: true,
          dt: 0.00001,
          exoPlanetArchive: true
        })
      )
    );
  }

  dispatch(boot(true));

  dispatch(
    setLoading({
      loading: false,
      whatIsLoading: ''
    })
  );
};