exports.handler = async (event) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Validating manufacturing order ${event.orderId} for vehicle ${event.vehicleType}...`);
      resolve();
    }, 2000);
  });

  const required = ['orderId', 'vehicleType', 'customerId', 'contractRef', 'targetLaunchDate', 'payloadClass', 'manufacturingFacility'];
  const missing = required.filter((f) => !event[f]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  const validVehicleTypes = ['SMALL_LV', 'MEDIUM_LV', 'HEAVY_LV', 'SUPER_HEAVY_LV', 'REUSABLE_FIRST_STAGE', 'UPPER_STAGE', 'KICK_STAGE'];
  if (!validVehicleTypes.includes(event.vehicleType)) {
    throw new Error(`Invalid vehicleType: ${event.vehicleType}. Must be one of: ${validVehicleTypes.join(', ')}`);
  }

  const vehicleSpecs = {
    SMALL_LV:              { stages: 2, engines: 3,  massToLeo: 1500,  massToGto: 500,   estProductionWeeks: 26 },
    MEDIUM_LV:             { stages: 2, engines: 9,  massToLeo: 8500,  massToGto: 4200,  estProductionWeeks: 52 },
    HEAVY_LV:              { stages: 3, engines: 27, massToLeo: 28000, massToGto: 11500, estProductionWeeks: 78 },
    SUPER_HEAVY_LV:        { stages: 2, engines: 33, massToLeo: 150000, massToGto: 21000, estProductionWeeks: 104 },
    REUSABLE_FIRST_STAGE:  { stages: 1, engines: 9,  massToLeo: null,  massToGto: null,  estProductionWeeks: 40 },
    UPPER_STAGE:           { stages: 1, engines: 1,  massToLeo: null,  massToGto: 6000,  estProductionWeeks: 18 },
    KICK_STAGE:            { stages: 1, engines: 1,  massToLeo: null,  massToGto: 500,   estProductionWeeks: 12 },
  };

  const specs = vehicleSpecs[event.vehicleType];
  const launchDate = new Date(event.targetLaunchDate);
  const productionDeadline = new Date(launchDate.getTime() - specs.estProductionWeeks * 7 * 86400000);
  const feasible = productionDeadline > new Date();

  return {
    ...event,
    manufacturingOrderId: `MO-${event.orderId}`,
    vehicleSpecs: specs,
    productionDeadline: productionDeadline.toISOString(),
    scheduleStatus: feasible ? 'ON_TRACK' : 'AT_RISK',
    validatedAt: new Date().toISOString(),
    orderStatus: 'VALIDATED',
  };
};
