export interface ToolItem {
  id: string;
  set: string; // matches ToolSet.id
  name: string;
  path: string;
  starred: boolean;
  runsLocally: boolean;
  isNetworkTool?: boolean;
  networkTarget?: string;
  iconName: string;
  description: string;
  shortDesc?: string;
  badge?: string;
}

export interface ToolSet {
  id: string;
  index: string; // "01", "02", etc.
  name: string;
  tagline: string;
  count: number;
  icon: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface SystemMetrics {
  cores: number;
  memory: string;
  isolated: boolean;
  webGPU: boolean;
  storageEstimate: string;
  transport: string;
}

export type MobileTab = 'browse' | 'tool' | 'info';
