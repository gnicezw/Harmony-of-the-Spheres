import jovianSystem from './jovianSystem';
import voyagerNeptune from './voyagerNeptune';
import saturnFull from './saturnFull';
import saturn from './saturn';
import threeBodyCoreography from './threeBodyCoreography';
import earthMoonSystem from './earthMoonSystem';
import oumuamua from './oumuamua';
import tess from './tess';
import martianSystem from './martianSystem';
import newHorizons from './newHorizons';
import cruithne from './cruithne';
import trappist1 from './trappist1';
import planetNine from './planetNine';
import shoemakerLevy9 from './shoemakerLevy9';
import rh120 from './rh120';
import ulysses from './ulysses';
import hd98800 from './hd98800';
import venusPentagram from './venusPentagram';
import uranianSystem from './Uranus';
import lunarFreeReturn from './lunarFreeReturn';
import starOfDavid from './starOfDavid';
import shenanigans from './shenanigans';
import innerSolarSystem from './innerSolarSystem';
import collisionsTest from './collisionsTest';
import kepler11 from './kepler11';
import the24sextantisSystem from './the24sextantisSystem';
import masses from '../masses';
import {
  calculateOrbitalVertices,
  elementsToVectors
} from '../../Physics/utils';
import { getRandomColor, getObjFromArrByKeyValuePair } from '../../utils';

/*
 * Takes an array of masses and populates them with values and when there are none defaults
*/

const processMasses = (scenarioMasses, massTemplates, dt) =>
  scenarioMasses.map(mass => {
    const template = getObjFromArrByKeyValuePair(
      massTemplates,
      'name',
      mass.name
    );

    return {
      ...mass,
      m:
        template === undefined
          ? mass.m === undefined ? 0 : mass.m
          : template.m,
      radius:
        template === undefined
          ? mass.radius === undefined ? 1.2 : mass.radius
          : template.radius,
      trailVertices:
        mass.trailVertices !== undefined
          ? mass.trailVertices
          : template === undefined
            ? calculateOrbitalVertices(mass.orbitalPeriod, dt)
            : calculateOrbitalVertices(template.orbitalPeriod, dt),
      tilt: template === undefined ? false : template.tilt,
      atmosphere: template === undefined ? false : template.atmosphere,
      clouds: template === undefined ? false : template.clouds,
      type:
        (template === undefined && mass.type === 'asteroid') ||
        (template === undefined && mass.type === 'star')
          ? mass.type
          : template.type,
      texture:
        template === undefined
          ? null
          : template.noTexture === true ? 'no texture' : template.name,
      bump: template === undefined ? null : template.bump,
      asteroidTexture: template === undefined ? null : template.asteroidTexture,
      color:
        template === undefined
          ? mass.color === undefined ? getRandomColor() : mass.color
          : template.color === undefined ? getRandomColor() : template.color
    };
  });

/*
 * Takes a scenario and populates it with defaults
*/

const processScenario = scenario => ({
  ...scenario,
  isLoaded: false,
  playing: false,
  integrator: 'RK4',
  particles:
    scenario.particles === undefined
      ? {
          max: 20000,
          size: 100000,
          rings: []
        }
      : scenario.particles,
  collisions: true,
  elapsedTime: 0,
  trails: scenario.trails !== undefined ? scenario.trails : true,
  labels: scenario.labels !== undefined ? scenario.labels : true,
  background: true,
  sizeAttenuation: true,
  scale: 2100000,
  velMax: 5,
  velMin: -5,
  velStep: 1.85765499287888e-6,
  masses:
    scenario.elementsToVectors === true
      ? processMasses(
          elementsToVectors(
            getObjFromArrByKeyValuePair(masses, 'name', scenario.primary),
            scenario.masses,
            scenario.g
          ),
          masses,
          scenario.dt
        )
      : processMasses(scenario.masses, masses, scenario.dt)
});

/*
 * Array that contains all the scenarios included in Harmony of the Spheres
*/

export const scenarios = [
  voyagerNeptune,
  shoemakerLevy9,
  saturn,
  uranianSystem,
  hd98800,
  collisionsTest,
  trappist1,
  innerSolarSystem,
  lunarFreeReturn,
  kepler11,
  the24sextantisSystem,
  shenanigans,
  venusPentagram,
  oumuamua,
  earthMoonSystem,
  jovianSystem,
  threeBodyCoreography,
  tess,
  martianSystem,
  saturnFull,
  newHorizons,
  cruithne,
  starOfDavid,
  planetNine,
  rh120,
  ulysses
];

/*
 * Takes the name of a scenario
 * Filters the scenarios array by name
 * Returns a clone of the scenario populated with defaults
*/

export default function(scenario) {
  const selectedScenario = getObjFromArrByKeyValuePair(
    scenarios,
    'name',
    scenario
  );

  return processScenario(JSON.parse(JSON.stringify(selectedScenario)));
}
