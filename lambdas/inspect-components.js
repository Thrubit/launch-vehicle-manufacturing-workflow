exports.handler = async (event) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Inspecting components for vehicle ${event.vehicleType} order ${event.orderId}...`);
      resolve();
    }, 2000);
  });

  const componentSets = {
    SMALL_LV:       ['STAGE_1_TANKAGE', 'STAGE_2_TANKAGE', 'ENGINE_SET_X3', 'INTERSTAGE', 'FAIRING', 'AVIONICS_SUITE', 'TVC_SYSTEM'],
    MEDIUM_LV:      ['STAGE_1_TANKAGE', 'STAGE_2_TANKAGE', 'ENGINE_SET_X9', 'INTERSTAGE', 'FAIRING_5M', 'AVIONICS_SUITE', 'TVC_SYSTEM', 'GRID_FINS', 'LANDING_LEGS'],
    HEAVY_LV:       ['CORE_STAGE_TANKAGE', 'BOOSTER_PAIR', 'UPPER_STAGE_TANKAGE', 'ENGINE_SET_X27', 'INTERSTAGE', 'FAIRING_5M', 'AVIONICS_SUITE'],
    SUPER_HEAVY_LV: ['SUPER_HEAVY_TANKAGE', 'SHIP_TANKAGE', 'ENGINE_SET_X33', 'ENGINE_SET_VACUUM_X6', 'CATCH_ARMS_MOUNT', 'HEAT_SHIELD', 'FLAPS_SET'],
    UPPER_STAGE:    ['UPPER_STAGE_TANKAGE', 'CENTAUR_ENGINE', 'AVIONICS_SUITE', 'SEPARATION_SYSTEM'],
    KICK_STAGE:     ['KICK_STAGE_TANKAGE', 'APOGEE_ENGINE', 'STAR_TRACKER', 'SEPARATION_COLLARS'],
  };

  const components = componentSets[event.vehicleType] || componentSets['MEDIUM_LV'];

  const inspectionResults = components.map((component) => {
    const passRate = 0.92 + Math.random() * 0.08;
    const passed = passRate > 0.93;
    return {
      component,
      inspectionType: 'NDT_VISUAL_DIMENSIONAL',
      passed,
      nonConformances: passed ? 0 : Math.ceil(Math.random() * 3),
      materialCertNumber: `CERT-${component.slice(0, 4)}-${Math.floor(Math.random() * 90000) + 10000}`,
      inspectedAt: new Date().toISOString(),
    };
  });

  const failedComponents = inspectionResults.filter((r) => !r.passed);
  const totalNonConformances = inspectionResults.reduce((sum, r) => sum + r.nonConformances, 0);

  return {
    ...event,
    componentInspection: {
      totalComponents: components.length,
      passed: components.length - failedComponents.length,
      failed: failedComponents.length,
      nonConformanceCount: totalNonConformances,
      failedComponents: failedComponents.map((r) => r.component),
      inspectionResults,
      inspectionStatus: failedComponents.length === 0 ? 'ALL_PASSED' : 'NCR_RAISED',
      completedAt: new Date().toISOString(),
    },
    inspectionStatus: failedComponents.length === 0 ? 'PASSED' : 'FAILED',
  };
};
