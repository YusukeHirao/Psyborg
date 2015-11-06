module psyborg {
	export interface IPsycleTransitionProcess {
		fallback?: string;
		fallbackFilter?: () => boolean;
		init: () => void;
		reflow: (info: IPsycleReflowInfo) => void;
		silent: () => void;
		before: () => void;
		fire: () => any;
		cancel: () => any;
		after: () => void;
	}
}