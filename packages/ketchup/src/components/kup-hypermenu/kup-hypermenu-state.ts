import { KupState } from '../kup-state/kup-state';
export class KupBoxState implements KupState {
    globalFilterValue: string = '';
    sortBy: string = '';
    selectedRowsState: string = '';
    pageSelected: number = 1;
    rowsPerPage: number = 0;
    load: boolean = false;

    /*Add attribute*/

    public toDebugString() {
        // TODO
        return 'box state';
    }
}
