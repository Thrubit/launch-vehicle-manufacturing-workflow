exports.handler = async (event) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Assembling stage for ${event.vehicleType} at ${event.manufacturingFacility}...`);
      resolve();
    }, 2000);
  });

  const assemblyProfiles = {
    SMALL_LV:       { assemblyDays: 45,  weldCount: 320,  boltCount: 4200,  criticalJoints: 12, cleanroomRequired: false },
    MEDIUM_LV:      { assemblyDays: 90,  weldCount: 850,  boltCount: 12000, criticalJoints: 28, cleanroomRequired: false },
    HEAVY_LV:       { assemblyDays: 150, weldCount: 2100, boltCount: 35000, criticalJoints: 64, cleanroomRequired: false },
    SUPER_HEAVY_LV: { assemblyDays: 210, weldCount: 4500, boltCount: 72000, criticalJoints: 120, cleanroomRequired: false },
    UPPER_STAGE:    { assemblyDays: 30,  weldCount: 180,  boltCount: 2800,  criticalJoints: 8,  cleanroomRequired: true },
    KICK_STAGE:     { assemblyDays: 14,  weldCount: 80,   boltCount: 1200,  criticalJoints: 4,  cleanroomRequired: true },
  };

  const profile = assemblyProfiles[event.vehicleType] || assemblyProfiles['MEDIUM_LV'];

  const assemblyMilestones = [
    { milestone: 'TANKAGE_WELDING', status: 'COMPLETE', completedAt: new Date().toISOString() },
    { milestone: 'ENGINE_INSTALLATION', status: 'COMPLETE', completedAt: new Date().toISOString() },
    { milestone: 'PLUMBING_INTEGRATION', status: 'COMPLETE', completedAt: new Date().toISOString() },
    { milestone: 'ELECTRICAL_HARNESS', status: 'COMPLETE', completedAt: new Date().toISOString() },
    { milestone: 'STAGE_CLOSEOUT', status: 'COMPLETE', completedAt: new Date().toISOString() },
  ];

  const plannedCompletion = new Date(Date.now() + profile.assemblyDays * 86400000).toISOString();

  return {
    ...event,
    stageAssembly: {
      ...profile,
      milestones: assemblyMilestones,
      allMilestonesComplete: true,
      plannedCompletionDate: plannedCompletion,
      assembledAt: new Date().toISOString(),
      facilityBayId: `BAY-${event.manufacturingFacility}-${Math.ceil(Math.random() * 8)}`,
    },
    assemblyStatus: 'COMPLETE',
  };
};
