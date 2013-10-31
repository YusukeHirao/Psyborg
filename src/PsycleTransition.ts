interface IPsycleReflowInfo {
	timing:PsycleReflowTiming;
}

interface IPsycleTransitionList {
	[index:string]:PsycleTransition;
}

interface IPsycleTransitionProcess {
	init:() => void;
	reflow:(info:IPsycleReflowInfo) => void;
	silent:() => void;
	before:() => void;
	fire:() => any;
	cancel:() => any;
	after:() => void;
}

interface IPsycleTransitionProcessList {
	[index:string]:IPsycleTransitionProcess;
}

class PsycleTransition {

	static transitions:IPsycleTransitionList = {};

	static create(processList:IPsycleTransitionProcessList):void {
		var transitionName:string;
		var transition:PsycleTransition;
		for (transitionName in processList) {
			transition = new PsycleTransition(transitionName, processList[transitionName]);
			PsycleTransition.transitions[transitionName] = transition;
		}
	}

	name:string;
	init:() => void;
	reflow:(info:IPsycleReflowInfo) => void;
	silent:() => void;
	before:() => void;
	fire:() => any;
	cancel:() => any;
	after:() => void;

	constructor (name:string, process:IPsycleTransitionProcess) {
		this.name = name;
		$.extend(this, process);
	}
}