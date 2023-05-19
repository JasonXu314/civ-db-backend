export type Era = 'Ancient' | 'Classical' | 'Medieval' | 'Renaissance' | 'Industrial' | 'Modern' | 'Atomic' | 'Information';
export const ERAS = ['Ancient', 'Classical', 'Medieval', 'Renaissance', 'Industrial', 'Modern', 'Atomic', 'Information'];

export enum DLC {
	BASE,
	RF,
	GS
}
export type DLCString = 'base' | 'rf' | 'gs';
export const DLC_STRINGS = ['base', 'rf', 'gs'];

export function dlcValue(dlc: DLCString): DLC {
	switch (dlc) {
		case 'base':
			return DLC.BASE;
		case 'rf':
			return DLC.RF;
		case 'gs':
			return DLC.GS;
		default:
			throw new Error('Bad DLC string');
	}
}
