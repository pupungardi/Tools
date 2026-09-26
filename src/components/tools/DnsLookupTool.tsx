import React, { useState } from 'react';
import { Globe, Search, RefreshCw, AlertTriangle, Check, ShieldAlert } from 'lucide-react';

interface Props {
  onFileOut: (bytes: number) => void;
}

interface DnsAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

export const DnsLookupTool: React.FC<Props> = ({ onFileOut }) => {
  const [domain, setDomain] = useState<string>('browserbasedtools.com');
  const [recordType, setRecordType] = useState<string>('A');
  const [loading, setLoading] = useState<boolean>(false);
  const [answers, setAnswers] = useState<DnsAnswer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const queryDns = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setError(null);

    try {
      // Cloudflare DNS over HTTPS RFC 8484 JSON API
      const res = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(
          domain.trim()
        )}&type=${recordType}`,
        {
          headers: {
            accept: 'application/dns-json',
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      if (data.Answer) {
        setAnswers(data.Answer);
      } else {
        setAnswers([]);
        setError(`No ${recordType} records found for "${domain}".`);
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to query DNS resolver.');
    } finally {
      setLoading(false);
    }
  };

  const getRecordTypeName = (typeCode: number) => {
    const map: Record<number, string> = {
      1: 'A',
      28: 'AAAA',
      15: 'MX',
      16: 'TXT',
      5: 'CNAME',
      6: 'SOA',
      2: 'NS',
    };
    return map[typeCode] || `TYPE-${typeCode}`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Explicit Network Privacy Disclosure as required by spec */}
      <div className="flex items-start gap-3 rounded border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="font-bold">Network Tool Notice: </span>
          <span>
            DNS lookup requires network transport. Your browser will send a direct HTTPS request to{' '}
            <strong className="font-mono-tech">cloudflare-dns.com</strong> (DoH). No intermediary server
            or third-party proxy is involved.
          </span>
        </div>
      </div>

      {/* Query Bar */}
      <div className="flex flex-wrap items-center gap-2 rounded border border-neutral-300 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-1 items-center gap-2 rounded border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-750 dark:bg-neutral-950">
          <Globe className="h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && queryDns()}
            placeholder="example.com"
            className="w-full bg-transparent font-mono-tech text-xs text-neutral-900 focus:outline-none dark:text-neutral-100"
          />
        </div>

        <select
          value={recordType}
          onChange={(e) => setRecordType(e.target.value)}
          className="rounded border border-neutral-300 bg-neutral-100 px-3 py-2 text-xs font-mono-tech font-semibold text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
        >
          {['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA'].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <button
          onClick={queryDns}
          disabled={loading}
          className="flex items-center gap-1.5 rounded bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
          Resolve
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded border border-neutral-300 bg-neutral-50 p-4 text-center font-mono-tech text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
          {error}
        </div>
      )}

      {/* Answers Table */}
      {answers.length > 0 && (
        <div className="overflow-hidden rounded border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
            DNS Answers ({answers.length})
          </div>
          <div className="divide-y divide-neutral-200 font-mono-tech text-xs dark:divide-neutral-800">
            {answers.map((a, i) => (
              <div key={i} className="flex flex-wrap items-center justify-between p-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-850">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-neutral-200 px-2 py-0.5 text-[11px] font-bold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                    {getRecordTypeName(a.type)}
                  </span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">{a.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-neutral-500">TTL: {a.TTL}s</span>
                  <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-1 font-bold text-emerald-600 dark:border-neutral-700 dark:bg-neutral-950 dark:text-emerald-400">
                    {a.data}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
