export default abstract class Rule {
	private nextRule: Rule | null = null;
	private firstRule: Rule;
	private lastRule: Rule;
	protected abstract errorMessage: string;
	protected abstract isValid(input: string): boolean;

	constructor() {
		this.firstRule = this;
		this.lastRule = this;
	}

	public addRule(rule: Rule) {
		this.lastRule.nextRule = rule;
		this.lastRule = this.lastRule.nextRule;
		return this.firstRule;
	}

	public validate(input: string): { errorMessage: string; error: boolean } {
		if (!this.isValid(input)) {
			return { errorMessage: this.errorMessage, error: true };
		}
		return this.nextRule
			? this.nextRule.validate(input)
			: { errorMessage: "", error: false };
	}
}
