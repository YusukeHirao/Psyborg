import { IPsycleReflowInfo } from './IPsycleReflowInfo';
import Psycle from './Psycle';
export interface IPsycleTransitionProcess {
    fallback?: string;
    fallbackFilter?(): boolean;
    init(psycle: Psycle): void;
    reflow(psycle: Psycle, info: IPsycleReflowInfo): void;
    silent(psycle: Psycle): void;
    before(psycle: Psycle): void;
    fire(psycle: Psycle): boolean | void;
    cancel(psycle: Psycle): boolean | void;
    after(psycle: Psycle): void;
}
