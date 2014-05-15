module psyborg {

	export interface IPsycleTransitionProcess {
		init:() => void;
		reflow:(info:IPsycleReflowInfo) => void;
		silent:() => void;
		before:() => void;
		fire:() => any;
		cancel:() => any;
		after:() => void;
	}

}