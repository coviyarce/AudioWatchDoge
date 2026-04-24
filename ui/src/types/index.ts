export interface Highlight {
  label: string;
  context: string;
  verbatim: string;
  timestamp: string;
}

export interface Device {
  name: string;
  is_loopback: boolean;
  label: string;
}

export interface AudioEngineState {
  levels: Record<string, number>;
  transcripts: string[];
  highlights: Highlight[];
  isMicRecording: boolean;
  isSystemRecording: boolean;
  packs: string[];
  selectedPack: string | null;
}
