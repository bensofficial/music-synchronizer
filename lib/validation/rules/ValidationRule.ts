export default abstract class ValidationRule {
	/* 
	points to the nextRule --> allows for chaining of rules e.g:
		string().maxLen(3).minLen(2)
	*/
	private nextRule: ValidationRule | null = null;

	/*
	if this is true, the variable doesn't has to exist
	*/
	public isNullable: boolean = false;

	/*
	pointers to the first and last rule in the linked list of rules
	*/
	private firstRule: ValidationRule;
	private lastRule: ValidationRule;
	protected abstract errorMessage: string;
	protected abstract isValid(input: string): boolean;

	constructor() {
		this.firstRule = this;
		this.lastRule = this;
	}

	public addRule(rule: ValidationRule) {
		this.lastRule.nextRule = rule;
		this.lastRule = this.lastRule.nextRule;
		/*
		When adding a new rule we always want to return the first list element
		to ensure that all rules are validated. If for example in:
			string().maxLen(2)
		the last rule was returned when chaining rules, only maxLen(2) would
		be validated when calling validate but not string
		*/
		return this.firstRule;
	}

	public nullable(): ValidationRule {
		this.isNullable = true;
		return this;
	}

	/*
	Validates all rules one after each other until one fails or the end is reached 
	*/
	public validate(input: string): { errorMessage: string; error: boolean } {
		if (!this.isValid(input)) {
			return { errorMessage: this.errorMessage, error: true };
		}
		return this.nextRule
			? this.nextRule.validate(input)
			: { errorMessage: "", error: false };
	}
}
