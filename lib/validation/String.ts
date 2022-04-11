import Rule from "./Rule";

export class String extends Rule {
	protected errorMessage = "Must be a string";

	protected isValid(input: string): boolean {
		return input.length >= 0;
	}

	public minLen(minLen: number): String {
		return this.addRule(new MinLength(minLen)) as String;
	}

	public maxLen(maxLen: number): String {
		return this.addRule(new MaxLength(maxLen)) as String;
	}

	public contains(regex: RegExp, groupName: string): String {
		return this.addRule(new Contains(regex, groupName)) as String;
	}

	public matchesString(shouldMatch: string, errorMessage: string): String {
		return this.addRule(
			new Matches(new RegExp(`^${shouldMatch}$`), errorMessage),
		) as String;
	}

	public matchesRegex(regex: RegExp, errorMessage: string): String {
		return this.addRule(new Matches(regex, errorMessage)) as String;
	}
}

class MinLength extends String {
	private len: number;

	constructor(minLen: number) {
		super();
		this.errorMessage = `Must be at least ${minLen} characters long`;
		this.len = minLen;
	}

	protected isValid(input: string): boolean {
		return input.length >= this.len;
	}
}

class MaxLength extends String {
	private len: number;

	constructor(maxLen: number) {
		super();
		this.errorMessage = `Can be at most ${maxLen} characters long`;
		this.len = maxLen;
	}

	protected isValid(input: string): boolean {
		return input.length <= this.len;
	}
}

class Contains extends String {
	private regex: RegExp;

	constructor(regex: RegExp, groupName: string) {
		super();
		this.regex = regex;
		this.errorMessage = `Must contain a ${groupName}`;
	}

	protected isValid(input: string) {
		return this.regex.test(input);
	}
}

class Matches extends String {
	private shouldMatch: RegExp;

	constructor(shouldMatch: RegExp, errorMessage: string) {
		super();
		this.errorMessage = errorMessage;
		this.shouldMatch = shouldMatch;
	}

	protected isValid(input: string): boolean {
		return this.shouldMatch.test(input);
	}
}

export default function string() {
	return new String();
}
