const fetch = require("node-fetch");
const path = require(`path`);
const fs = require("fs");

const map = (array, index, callback, output = []) =>
  index === array.length
    ? output
    : map(array, index + 1, callback, [callback(array[index]), ...output]);

const SUN_RADIUS = 9767.441860465116;
const JUPITER_MASS = 9.543e-4;
const JUPITER_RADIUS = 976.7441860465117;
const G = 39.5;
const DT = 0.00005;
const SCALE = 2100000;

const chunkScenarios = (data, scenarios, i, currentScenarioName) => {
  if (i === data.length) {
    return scenarios;
  } else {
    if (data[i]["pl_hostname"] === currentScenarioName) {
      scenarios[scenarios.length - 1].push(data[i]);
    } else {
      scenarios.push([data[i]]);
    }

    i += 1;

    return chunkScenarios(data, scenarios, i, data[i - 1]["pl_hostname"]);
  }
};

const createExoplanetScenarios = async () => {
  const url =
    "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=exoplanets&select=pl_hostname,st_mass,st_teff,st_rad,pl_letter,pl_bmassj,pl_radj,pl_orbper,pl_orbsmax,pl_pnum,pl_orbeccen,pl_orblper,pl_facility,pl_orbincl,pl_facility&where=pl_pnum>0 and pl_orbsmax>0 and st_mass>0 and st_rad>0&format=json";

  const response = await fetch(url);

  const data = await response.json();

  const sortedScenarios = data.sort((a, b) => {
    var textA = a.pl_hostname.toUpperCase();
    var textB = b.pl_hostname.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });

  const scenarios = chunkScenarios(
    sortedScenarios,
    [[]],
    0,
    sortedScenarios[0]["pl_hostname"]
  );

  const processedPlanets = map(scenarios, 0, scenario => {
    const widestOrbit = Math.max(...scenario.map(mass => mass.pl_orbsmax));

    return {
      name: scenario[0].pl_hostname,
      description: `3D visualisation and gravity simulation of the exoplanet system ${scenario[0].pl_hostname}, which contains ${scenario[0].pl_pnum} planets and was discovered by ${scenario[0].pl_facility}.`,
      particlesFun: false,
      type: "Exoplanets",
      pl_pnum: scenario[0].pl_pnum,
      g: G,
      dt: DT,
      distMax: 50,
      distMin: -50,
      rotatingReferenceFrame: scenario[0].pl_hostname,
      cameraFocus: "Barycenter",
      particles: { max: 20000, size: 10, rings: [] },
      massBeingModified: "Mars",
      primary: scenario[0].pl_hostname,
      maximumDistance: { name: "Phobos to Mars * 100", value: 0.00626747 },
      distanceStep: { name: "Phobos to Mars / 10", value: 0.00000626747 },
      scenarioWikiUrl: "https://en.wikipedia.org/wiki/Mars",
      systemBarycenter: true,
      barycenter: true,
      barycenterMassOne: scenario[0].pl_hostname,
      barycenterMassTwo: scenario[0].pl_hostname,
      tol: 1e-4,
      maxDt: 1e-3,
      minDt: 1e-6,
      drawLineEvery: 6,
      isLoaded: false,
      playing: false,
      integrator: "PEFRL",
      customCameraToBodyDistanceFactor: false,
      barycenterZ: widestOrbit * SCALE * 3,
      elapsedTime: 0,
      useBarnesHut: false,
      theta: 0.5,
      collisions: true,
      habitableZone: true,
      referenceOrbits: false,
      softeningConstant: 0,
      logarithmicDepthBuffer: false,
      scale: 2100000,
      trails: true,
      labels: true,
      trajectoryRendevouz: {
        x: 0,
        y: 0,
        z: 0,
        p: { x: 0, y: 0, z: 0, t: 0 }
      },
      velMax: 5,
      velMin: -5,
      velStep: 0.00000185765499287888,
      isMassBeingAdded: false,
      a: 0,
      e: 0,
      w: 0,
      i: 0,
      o: 0,
      masses: [
        {
          name: scenario[0].pl_hostname,
          m: scenario[0].st_mass,
          radius: scenario[0].st_rad * SUN_RADIUS,
          temperature: scenario[0].st_teff,
          massType: "star"
        },
        ...map(scenario, 0, planet => ({
          name: planet.pl_letter,
          noTexture: true,
          m:
            planet.pl_bmassj == null
              ? 0.0000000000001
              : planet.pl_bmassj * JUPITER_MASS,
          radius:
            (planet.pl_rad == null ? 0.1 : planet.pl_rad) * JUPITER_RADIUS,
          a: planet.pl_orbsmax,
          e: planet.pl_orbeccen == null ? 0 : planet.pl_orbeccen,
          w: planet.pl_orblper == null ? 0 : planet.pl_orblper,
          i: planet.pl_orbinc == null ? 0 : planet.pl_orbinc,
          o: 0,
          orbitalPeriod: planet.pl_orbper
        }))
      ]
    };
  });

  map(processedPlanets, 0, scenario => {
    fs.writeFileSync(
      `./src/data/scenarios/${scenario.name}.json`,
      JSON.stringify(scenario)
    );
  });
};

createExoplanetScenarios();