exports.handler = async (event) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Certifying vehicle ${event.orderId} for flight...`);
      resolve();
    }, 2000);
  });

  const certificationChecklist = [
    { item: 'COMPONENT_INSPECTION_PASSED', verified: event.inspectionStatus === 'PASSED' },
    { item: 'STRUCTURAL_TESTS_PASSED', verified: event.structuralTestStatus === 'PASSED' },
    { item: 'AVIONICS_INTEGRATED', verified: event.avionicsStatus === 'INTEGRATED' },
    { item: 'HOT_FIRE_TEST_PASSED', verified: event.hotFireStatus === 'PASSED' },
    { item: 'ASSEMBLY_COMPLETE', verified: event.assemblyStatus === 'COMPLETE' },
    { item: 'EXPORT_CONTROL_CLEARED', verified: true },
    { item: 'SAFETY_REVIEW_BOARD_APPROVED', verified: event.severity !== 'CRITICAL' },
    { item: 'FAA_LAUNCH_LICENSE_VALID', verified: true },
    { item: 'RANGE_SAFETY_CLEARED', verified: true },
  ];

  const failedItems = certificationChecklist.filter((i) => !i.verified);
  const certified = failedItems.length === 0;

  const certNumber = `CERT-LV-${event.vehicleType.charAt(0)}${Date.now().toString().slice(-6)}`;
  const certExpiry = new Date(Date.now() + 365 * 86400000).toISOString();

  return {
    ...event,
    vehicleCertification: {
      certificationNumber: certified ? certNumber : null,
      checklist: certificationChecklist,
      failedItems: failedItems.map((i) => i.item),
      certificationAuthority: 'VEHICLE_CERTIFICATION_BOARD',
      flightReadinessReviewPassed: certified,
      certificationStatus: certified ? 'CERTIFIED' : 'REJECTED',
      certificationExpiry: certified ? certExpiry : null,
      certifiedAt: new Date().toISOString(),
    },
    certificationStatus: certified ? 'FLIGHT_READY' : 'NOT_CERTIFIED',
  };
};
