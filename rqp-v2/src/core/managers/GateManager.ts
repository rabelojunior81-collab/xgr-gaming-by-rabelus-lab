import { Gate, GateResult, GateItemResult, GatePhase } from '../../types/index.js';

export interface GateContext {
  projectPath: string;
  autoChecks?: Record<string, boolean>;
  manualConfirmations?: Record<string, boolean>;
  evidence?: Record<string, string>;
}

export class GateManager {
  private gates: Map<string, Gate> = new Map();

  constructor() {
    this.initializeGates();
  }

  private initializeGates(): void {
    const gates: Gate[] = [
      {
        id: 'SG-001',
        name: 'Discovery Gate',
        phase: 'discovery',
        checkItems: [
          { id: 'SG-001-1', item: 'Problem understood', validation: 'Problem statement documented', evidenceRequired: true },
          { id: 'SG-001-2', item: 'Stakeholders identified', validation: 'Stakeholder list created', evidenceRequired: true },
        ],
        passCriteria: { mandatory: ['SG-001-1'], minimumScore: 80 },
      },
      {
        id: 'SG-002',
        name: 'Specification Gate',
        phase: 'specification',
        checkItems: [
          { id: 'SG-002-1', item: 'Requirements defined', validation: 'SPEC.md created', evidenceRequired: true },
        ],
        passCriteria: { mandatory: ['SG-002-1'], minimumScore: 80 },
      },
    ];

    gates.forEach(gate => this.gates.set(gate.id, gate));
  }

  getGate(id: string): Gate | undefined {
    return this.gates.get(id);
  }

  getAllGates(): Gate[] {
    return Array.from(this.gates.values());
  }

  getGatesByPhase(phase: GatePhase): Gate[] {
    return this.getAllGates().filter(g => g.phase === phase);
  }

  async runGate(gateId: string, context: GateContext): Promise<GateResult> {
    const gate = this.gates.get(gateId);
    if (!gate) {
      throw new Error(`Gate ${gateId} not found`);
    }

    const itemResults: GateItemResult[] = [];
    let passedCount = 0;

    for (const item of gate.checkItems) {
      const result = await this.evaluateItem(item, context);
      itemResults.push(result);
      if (result.passed) passedCount++;
    }

    const score = (passedCount / gate.checkItems.length) * 100;
    const passed = score >= gate.passCriteria.minimumScore && 
                   this.checkMandatoryItems(gate, itemResults);

    return {
      gateId,
      passed,
      score,
      items: itemResults,
      timestamp: new Date(),
    };
  }

  private async evaluateItem(
    item: Gate['checkItems'][0],
    context: GateContext
  ): Promise<GateItemResult> {
    if (item.autoVerifiable && context.autoChecks?.[item.id]) {
      return { itemId: item.id, passed: true, evidence: 'Auto-verified' };
    }

    if (context.manualConfirmations?.[item.id] !== undefined) {
      return {
        itemId: item.id,
        passed: context.manualConfirmations[item.id],
        evidence: context.evidence?.[item.id],
      };
    }

    return { itemId: item.id, passed: false, notes: 'Not evaluated' };
  }

  private checkMandatoryItems(gate: Gate, results: GateItemResult[]): boolean {
    const mandatoryIds = new Set(gate.passCriteria.mandatory);
    
    for (const result of results) {
      if (mandatoryIds.has(result.itemId) && !result.passed) {
        return false;
      }
    }
    
    return true;
  }
}
