exports.handler = async (event) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Conducting hot fire test for ${event.vehicleType} ${event.orderId}...`);
      resolve();
    }, 2000);
  });

  const hotFireProfiles = {
    SMALL_LV:       { nominalBurnSeconds: 180, chamberPressurePsi: 1200, thrustKN: 180, isp: 311 },
    MEDIUM_LV:      { nominalBurnSeconds: 162, chamberPressurePsi: 1850, thrustKN: 7607, isp: 311 },
    HEAVY_LV:       { nominalBurnSeconds: 162, chamberPressurePsi: 1850, thrustKN: 22819, isp: 311 },
    SUPER_HEAVY_LV: { nominalBurnSeconds: 170, chamberPressurePsi: 3500, thrustKN: 74000, isp: 350 },
    UPPER_STAGE:    { nominalBurnSeconds: 397, chamberPressurePsi: 800, thrustKN: 100, isp: 451 },
    KICK_STAGE:     { nominalBurnSeconds: 60,  chamberPressurePsi: 600, thrustKN: 22, isp: 310 },
  };

  const profile = hotFireProfiles[event.vehicleType] || hotFireProfiles['MEDIUM_LV'];
  const actualBurnSeconds = profile.nominalBurnSeconds * (0.97 + Math.random() * 0.05);
  const actualThrust = profile.thrustKN * (0.98 + Math.random() * 0.04);

  const engineMetrics = {
    burnDurationSeconds: parseFloat(actualBurnSeconds.toFixed(1)),
    peakChamberPressurePsi: profile.chamberPressurePsi * (0.99 + Math.random() * 0.03),
    measuredThrustKN: parseFloat(actualThrust.toFixed(1)),
    specificImpulse: profile.isp * (0.98 + Math.random() * 0.03),
    propellantFlowRateKgS: parseFloat((actualThrust * 1000 / (profile.isp * 9.81)).toFixed(2)),
  };

  const testPassed = engineMetrics.burnDurationSeconds >= profile.nominalBurnSeconds * 0.95
    && engineMetrics.measuredThrustKN >= profile.thrustKN * 0.97;

  return {
    ...event,
    hotFireTest: {
      testStand: `HFT-STAND-${event.vehicleType.charAt(0)}1`,
      nominalProfile: profile,
      measuredMetrics: engineMetrics,
      anomaliesDetected: [],
      testPassed,
      dataRecorded: true,
      testedAt: new Date().toISOString(),
    },
    hotFireStatus: testPassed ? 'PASSED' : 'FAILED',
  };
};
