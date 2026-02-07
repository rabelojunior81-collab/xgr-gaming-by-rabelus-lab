export class GateManager {
    gates = new Map();
    constructor() {
        this.initializeGates();
    }
    initializeGates() {
        const gates = [
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
    getGate(id) {
        return this.gates.get(id);
    }
    getAllGates() {
        return Array.from(this.gates.values());
    }
    getGatesByPhase(phase) {
        return this.getAllGates().filter(g => g.phase === phase);
    }
    async runGate(gateId, context) {
        const gate = this.gates.get(gateId);
        if (!gate) {
            throw new Error(`Gate ${gateId} not found`);
        }
        const itemResults = [];
        let passedCount = 0;
        for (const item of gate.checkItems) {
            const result = await this.evaluateItem(item, context);
            itemResults.push(result);
            if (result.passed)
                passedCount++;
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
    async evaluateItem(item, context) {
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
    checkMandatoryItems(gate, results) {
        const mandatoryIds = new Set(gate.passCriteria.mandatory);
        for (const result of results) {
            if (mandatoryIds.has(result.itemId) && !result.passed) {
                return false;
            }
        }
        return true;
    }
}
//# sourceMappingURL=GateManager.js.map