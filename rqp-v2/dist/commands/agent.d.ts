interface AgentOptions {
    command: string;
    code?: string;
    to?: string;
    reason?: string;
}
export declare function agentCommand(command: string, options: AgentOptions): Promise<void>;
export {};
//# sourceMappingURL=agent.d.ts.map