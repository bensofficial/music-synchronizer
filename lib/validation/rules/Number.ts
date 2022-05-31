import ValidationRule from "./ValidationRule";

export default class Number extends ValidationRule {
	protected errorMessage = "Must be a string";

	protected isValid(input: string): boolean {
		const float = parseFloat(input);

		if (isNaN(float)) {
			return false;
		}

		return true;
	}

	public integer(): Number {
		return this.addRule(new Integer()) as Number;
	}

	public greaterThan(min: number): Number {
		return this.addRule(new GreaterThan(min)) as Number;
	}

	public lessThan(max: number): Number {
		return this.addRule(new LessThan(max)) as Number;
	}
}

class Integer extends Number {
	protected errorMessage = "Must be an integer";

	isValid(input: string): boolean {
		const int = parseInt(input, 10);

		if (isNaN(int)) {
			return false;
		}

		return true;
	}
}

class GreaterThan extends Number {
	private min: number;

	constructor(min: number) {
		super();
		this.errorMessage = `Must be greater than ${min}`;
		this.min = min;
	}

	protected isValid(input: string): boolean {
		const int = parseInt(input, 10);
		return int > this.min;
	}
}

class LessThan extends Number {
	private max: number;

	constructor(max: number) {
		super();
		this.errorMessage = `Must be less than ${max}`;
		this.max = max;
	}

	protected isValid(input: string): boolean {
		const int = parseInt(input, 10);
		return int < this.max;
	}
}
