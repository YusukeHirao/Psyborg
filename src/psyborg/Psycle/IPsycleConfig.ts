module psyborg {

	export interface IPsycleConfig {
		instanceKey:string;
		startIndex:number;
		transition:string;
		duration:number;
		easing:string;
		delay:number;
		auto:boolean;
		delayWhenFire:number;
		cancel:boolean;
		repeat:any;
		container:string;
		panels:string;
		currentClass:string;
		clone: number;
		cols:number;
		rows:number;
		offsetX:number;
		offsetY:number;
		nearby:boolean;
		innerFocus:boolean;
		noFocus:boolean;
		resizable:boolean;
		draggable:boolean;
		swipeable:boolean;
		dragBlockVertical:boolean;
		bindKeyboard:boolean;
		showOnlyOnce:string;
		controller:any;
		marker:any;
		thumbnail:any;
		css3:boolean;
		loopCloneLength:number;
		scenes:Function[];
	}

}
