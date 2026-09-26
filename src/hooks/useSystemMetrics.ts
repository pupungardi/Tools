import { useState, useEffect } from 'react';
import { SystemMetrics } from '../types';

export function useSystemMetrics(): SystemMetrics {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cores: 8,
    memory: 'Available',
    isolated: false,
    webGPU: false,
    storageEstimate: 'Persistent',
    transport: 'Loopback / Memory',
  });

  useEffect(() => {
    // 1. Cores
    const cores = navigator.hardwareConcurrency || 8;

    // 2. Memory (if performance.memory available in Chromium)
    let memoryStr = 'Available';
    const perf = window.performance as unknown as { memory?: { jsHeapSizeLimit: number; totalJSHeapSize: number } };
    const nav = navigator as unknown as { deviceMemory?: number; gpu?: unknown };
    if (perf?.memory?.jsHeapSizeLimit) {
      const mb = Math.round(perf.memory.jsHeapSizeLimit / (1024 * 1024));
      memoryStr = `~${mb} MB Heap`;
    } else if (nav.deviceMemory) {
      memoryStr = `${nav.deviceMemory} GB RAM`;
    }

    // 3. Isolated
    const isolated = window.crossOriginIsolated || false;

    // 4. WebGPU
    let hasWebGPU = false;
    if ('gpu' in navigator && navigator.gpu) {
      hasWebGPU = true;
    }

    // 5. Storage estimate
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((est) => {
        if (est.quota) {
          const quotaGB = (est.quota / (1024 * 1024 * 1024)).toFixed(1);
          setMetrics((prev) => ({
            ...prev,
            storageEstimate: `${quotaGB} GB quota`,
          }));
        }
      }).catch(() => {});
    }

    setMetrics({
      cores,
      memory: memoryStr,
      isolated,
      webGPU: hasWebGPU,
      storageEstimate: 'Persistent quota',
      transport: 'Loopback / Memory',
    });
  }, []);

  return metrics;
}
