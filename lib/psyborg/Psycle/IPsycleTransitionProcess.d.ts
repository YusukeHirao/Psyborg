import { IPsycleReflowInfo } from './IPsycleReflowInfo';
export interface IPsycleTransitionProcess {
    fallback?: string;
    fallbackFilter?: () => boolean;
    init: () => void;
    reflow: (info: IPsycleReflowInfo) => void;
    silent: () => void;
    before: () => void;
    fire: () => boolean | void;
    cancel: () => boolean | void;
    after: () => void;
}
