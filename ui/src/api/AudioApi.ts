/**
 * @file AudioApi.ts
 * @description Centralized API service for AudioWatchDoge backend communication.
 */

const BASE_URL = 'http://localhost:8000';

export const AudioApi = {
  /** Fetch available audio devices from the engine */
  fetchDevices: async () => {
    const res = await fetch(`${BASE_URL}/devices`);
    return res.json();
  },

  /** Select a specific device on the backend */
  selectDevice: async (label: string, deviceName: string) => {
    return fetch(`${BASE_URL}/select-device`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, device_name: deviceName })
    });
  },

  /** Remotely start the Windows Python proxies */
  startProxies: async () => {
    return fetch(`${BASE_URL}/start-engine`, { method: 'POST' });
  },

  /** Fetch available intelligence packs */
  fetchPacks: async () => {
    const res = await fetch(`${BASE_URL}/packs`);
    return res.json();
  },

  /** Select an intelligence pack */
  selectPack: async (packId: string) => {
    return fetch(`${BASE_URL}/select-pack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pack_id: packId })
    });
  },

  /** Update keyword subjects for live filtering */
  updateSubjects: async (subjects: string[]) => {
    return fetch(`${BASE_URL}/update-subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjects })
    });
  }
};
