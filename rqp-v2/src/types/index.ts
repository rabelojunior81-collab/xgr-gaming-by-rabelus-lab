// ============================================
// RQP Core Types v2.0.0
// ============================================

// --------------------------------------------
// Soul System Types
// --------------------------------------------

export interface Soul {
  soul_id: string;
  soul_version: string;
  identity: SoulIdentity;
  genome?: SoulGenome;
}

export interface SoulIdentity {
  code: string;
  name: string;
  type: 'Central' | 'Fase' | 'Execucao' | 'Validacao' | 'Emergencia' | 'Transversal';
  level: number | 'E' | 'T';
  description: string;
}

export interface SoulGenome {
  capabilities: Capability[];
  limits: string[];
  interactions?: Record<string, Interaction>;
}

export interface Capability {
  id: string;
  description: string;
  skills: string[];
}

export interface Interaction {
  relationship: string;
  trigger?: string;
  purpose: string;
}

// --------------------------------------------
// Agent Types
// --------------------------------------------

export type AgentCode = 
  | 'ORCH-000'
  | 'DISC-001'
  | 'SPEC-001'
  | 'ARCH-001'
  | 'IMPL-001'
  | 'VALD-001'
  | 'RETR-001'
  | 'BUGF-001'
  | 'SECR-001';

export interface Agent {
  code: AgentCode;
  name: string;
  status: 'idle' | 'active' | 'waiting' | 'completed';
  soul: Soul;
}

export interface HandoffContext {
  from: AgentCode;
  to: AgentCode;
  reason: string;
  artifacts: string[];
  decisions: string[];
}

// --------------------------------------------
// Gate System Types
// --------------------------------------------

export type GatePhase = 
  | 'discovery' 
  | 'specification' 
  | 'architect' 
  | 'implementation' 
  | 'validation' 
  | 'release';

export interface Gate {
  id: string;
  name: string;
  phase: GatePhase;
  checkItems: GateCheckItem[];
  passCriteria: PassCriteria;
}

export interface GateCheckItem {
  id: string;
  item: string;
  validation: string;
  evidenceRequired: boolean;
  autoVerifiable?: boolean;
}

export interface PassCriteria {
  mandatory: string[];
  minimumScore: number;
}

export interface GateResult {
  gateId: string;
  passed: boolean;
  score: number;
  items: GateItemResult[];
  timestamp: Date;
}

export interface GateItemResult {
  itemId: string;
  passed: boolean;
  evidence?: string;
  notes?: string;
}

export interface GateContext {
  projectPath: string;
  autoChecks?: Record<string, boolean>;
  manualConfirmations?: Record<string, boolean>;
  evidence?: Record<string, string>;
}

// --------------------------------------------
// Project Types
// --------------------------------------------

export interface ProjectStatus {
  projectName: string;
  currentPhase: GatePhase;
  currentAgent: AgentCode;
  gatesCompleted: number;
  totalGates: number;
  lastUpdated: Date;
}

export interface RQPConfig {
  projectName: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

// --------------------------------------------
// Task Types
// --------------------------------------------

export interface Task {
  id: string;
  agent: AgentCode;
  type: string;
  inputs: TaskInputs;
  outputs: TaskOutputs;
  phases: TaskPhases;
}

export interface TaskInputs {
  required: string[];
  optional?: string[];
}

export interface TaskOutputs {
  required: string[];
  optional?: string[];
}

export interface TaskPhases {
  [phaseName: string]: TaskStep[];
}

export interface TaskStep {
  id: string;
  action: string;
  verification: string;
  tools?: string[];
}

// --------------------------------------------
// Quiz Types
// --------------------------------------------

export interface Quiz {
  id: string;
  type: QuizType;
  questions: QuizQuestion[];
}

export type QuizType = 'stakeholder' | 'project' | 'agent';

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'text' | 'select' | 'multiselect' | 'confirm';
  options?: string[];
  validation?: QuizValidation;
}

export interface QuizValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface QuizAnswers {
  quizId: string;
  answers: Record<string, unknown>;
  timestamp: Date;
}

// --------------------------------------------
// Audit Types
// --------------------------------------------

export interface AuditReport {
  projectPath: string;
  stack: StackInfo;
  architecture: ArchitectureInfo;
  dependencies: DependencyReport;
  codeMetrics: CodeMetrics;
  recommendations: string[];
}

export interface StackInfo {
  language: string;
  framework?: string;
  buildTool?: string;
  detected: boolean;
}

export interface ArchitectureInfo {
  structure: string;
  entryPoints: string[];
  patterns: string[];
}

export interface DependencyReport {
  dependencies: Dependency[];
  devDependencies: Dependency[];
  outdated: Dependency[];
  vulnerabilities: Dependency[];
}

export interface Dependency {
  name: string;
  version: string;
  latestVersion?: string;
  type: 'production' | 'development';
}

export interface CodeMetrics {
  fileCount: number;
  linesOfCode: number;
  testFiles: number;
  averageComplexity: number;
  filesOver500Lines: string[];
  testCoverage?: number;
}

// --------------------------------------------
// Research Types
// --------------------------------------------

export interface ResearchTopic {
  topic: string;
  depth: 'shallow' | 'medium' | 'deep';
}

export interface ResearchResult {
  source: string;
  title: string;
  summary: string;
  relevance: number;
}

export interface ResearchReport {
  topic: string;
  results: ResearchResult[];
  analysis: string;
  recommendations: string[];
  timestamp: Date;
}

// --------------------------------------------
// Doc Types
// --------------------------------------------

export type DocType = 'spec' | 'decisions' | 'implementation' | 'test-plan' | 'retrospective';

// --------------------------------------------
// CLI Types
// --------------------------------------------

export interface CLIOptions {
  verbose?: boolean;
  json?: boolean;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
