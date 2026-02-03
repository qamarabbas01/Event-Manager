import type { IconComponent } from '$lib/types/icons';

export type { IconComponent } from '$lib/types/icons';

export interface DropdownItem {
	label: string;
	href?: string;
	icon?: IconComponent;
	onclick?: () => void;
	disabled?: boolean;
	divider?: boolean;
}
