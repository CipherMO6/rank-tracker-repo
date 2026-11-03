import { Health } from '@capgo/capacitor-health';

async function ensureAccess() {
  const a = await Health.isAvailable();
  if (!a.available) {
    if (a.platform === 'android') await Health.openHealthConnectSettings();
    throw new Error('Health Connect unavailable');
  }
  const s = await Health.requestAuthorization({ read: ['steps'], write: [] });
  if (s.readDenied && s.readDenied.length) throw new Error('permission denied');
}

window.HealthBridge = {
  steps: async function () {
    await ensureAccess();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const r = await Health.queryAggregated({
      dataType: 'steps',
      startDate: start.toISOString(),
      endDate: new Date().toISOString(),
      bucket: 'day',
      aggregation: 'sum',
    });
    let n = 0;
    (r.samples || []).forEach(function (x) {
      n += x.value != null ? x.value : (x.values && x.values.sum) || 0;
    });
    return Math.round(n);
  },
};
