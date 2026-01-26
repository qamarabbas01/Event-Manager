<script lang="ts">
	import type { IconComponent } from '$lib/types/icons';

	type ButtonVariant =
		| 'default'
		| 'primary-orange'
		| 'primary-blue'
		| 'secondary'
		| 'tertiary-white'
		| 'tertiary-blue'
		| 'neutral-gray'
		| 'light-gray'
		| 'sand'
		| 'pink'
		| 'golden-orange'
		| 'transparent'
		| 'light-pink'
		| 'white';
	type ButtonSize = 'lg' | 'default' | 'sm';
	type ButtonState = 'default' | 'hover' | 'focused' | 'disabled';

	interface Props {
		text?: string;
		variant?: ButtonVariant;
		size?: ButtonSize;
		state?: ButtonState;
		disabled?: boolean;
		class?: string;
		href?: string;
		customIcon?: IconComponent;
		customIconPosition?: 'left' | 'right';
		iconSize?: number;
		onClick?: () => void;
	}

	let {
		text = 'Button',
		variant = 'default',
		size = 'default',
		state = 'default',
		disabled = false,
		class: className = '',
		href,
		customIcon,
		customIconPosition = 'left',
		iconSize,
		onClick
	}: Props = $props();

	let isDisabled = $derived(disabled || state === 'disabled');
	let effectiveState = $derived(isDisabled ? 'disabled' : state);

	let baseClasses = $derived(
		'inline-flex items-center justify-center gap-2 rounded-button border transition-all focus-visible:outline-none focus-visible:ring-3'
	);

	let sizeClasses = $derived(
		{
			lg: 'h-[52px] min-w-[5rem] px-5 py-2 text-base',
			default: 'h-[40px] min-w-[5rem] px-5 py-2 text-base',
			sm: 'h-[32px] min-w-[4rem] px-3 py-1.5 text-sm'
		}[size]
	);

	let variantClasses = $derived(
		{
			default: {
				default: 'cursor-pointer',
				hover: 'cursor-pointer',
				focused: 'cursor-pointer',
				disabled: 'cursor-not-allowed'
			},
			'primary-orange': {
				default:
					'bg-brand-orange text-[#000] border-brand-orange hover:bg-brand-orange-hover hover:border-brand-orange-hover focus-visible:ring-brand-orange cursor-pointer',
				hover: 'bg-brand-orange-hover text-[#000] border-brand-orange-hover',
				focused:
					'bg-brand-orange text-[#000] border-brand-white border-2 focus-visible:ring-brand-orange',
				disabled: 'bg-brand-gray-2 text-brand-gray-3 border-brand-gray-2 cursor-not-allowed'
			},
			'primary-blue': {
				default:
					'bg-brand-dark-blue text-brand-orange border-brand-dark-blue hover:bg-brand-dark-blue-hover hover:border-brand-dark-blue-hover focus-visible:ring-brand-orange cursor-pointer',
				hover: 'bg-brand-dark-blue-hover text-brand-orange border-brand-dark-blue-hover',
				focused:
					'bg-brand-dark-blue text-brand-orange border-brand-white border-2 focus-visible:ring-brand-orange',
				disabled: 'bg-brand-gray-2 text-brand-gray-3 border-brand-gray-2 cursor-not-allowed'
			},
			secondary: {
				default:
					'bg-brand-dark-blue text-brand-orange border-brand-dark-blue hover:bg-brand-dark-blue-hover hover:border-brand-dark-blue-hover focus-visible:ring-brand-orange cursor-pointer',
				hover: 'bg-brand-dark-blue-hover text-brand-orange border-brand-dark-blue-hover',
				focused:
					'bg-brand-dark-blue text-brand-orange border-brand-white border-2 focus-visible:ring-brand-orange',
				disabled: 'bg-brand-gray-2 text-brand-gray-3 border-brand-gray-2 cursor-not-allowed'
			},
			'tertiary-white': {
				default:
					'bg-brand-white text-brand-dark border-brand-gray-2 hover:bg-brand-gray-1 hover:border-brand-gray-2 focus-visible:ring-brand-orange cursor-pointer',
				hover: 'bg-brand-gray-1 text-brand-dark border-brand-gray-2',
				focused:
					'bg-brand-white text-brand-dark border-brand-white border-2 focus-visible:ring-brand-orange',
				disabled: 'bg-brand-white text-brand-gray-3 border-brand-gray-2 cursor-not-allowed'
			},
			'tertiary-blue': {
				default:
					'bg-brand-white text-brand-boy-blue border-brand-gray-2 hover:bg-brand-gray-1 hover:border-brand-gray-2 focus-visible:ring-brand-orange cursor-pointer',
				hover: 'bg-brand-gray-1 text-brand-boy-blue border-brand-gray-2',
				focused:
					'bg-brand-white text-brand-boy-blue border-brand-white border-2 focus-visible:ring-brand-orange',
				disabled: 'bg-brand-white text-brand-gray-3 border-brand-gray-2 cursor-not-allowed'
			},
			'neutral-gray': {
				default:
					'bg-brand-medium-gray text-brand-white border-brand-medium-gray hover:bg-gray-600 hover:border-gray-600 focus-visible:ring-brand-orange cursor-pointer',
				hover: 'bg-gray-600 text-brand-white border-gray-600',
				focused:
					'bg-brand-medium-gray text-brand-white border-brand-white border-2 focus-visible:ring-brand-orange',
				disabled: 'bg-brand-gray-2 text-brand-gray-3 border-brand-gray-2 cursor-not-allowed'
			},
			'light-gray': {
				default:
					'bg-brand-gray-2 text-brand-dark border-brand-gray-2 hover:bg-brand-gray-3 hover:border-brand-gray-3 focus-visible:ring-brand-orange cursor-pointer',
				hover: 'bg-brand-gray-3 text-brand-dark border-brand-gray-3',
				focused:
					'bg-brand-gray-2 text-brand-dark border-brand-white border-2 focus-visible:ring-brand-orange',
				disabled: 'bg-brand-gray-2 text-brand-gray-3 border-brand-gray-2 cursor-not-allowed'
			},
			sand: {
				default:
					'bg-[#F8F4EF] text-brand-dark border-[#F8F4EF] hover:bg-brand-sand-hover hover:border-brand-sand-hover focus-visible:ring-brand-orange cursor-pointer',
				hover: 'bg-[#F8F4EF] text-brand-dark border-[#F8F4EF]',
				focused:
					'bg-[#F8F4EF] text-brand-dark border-[#F8F4EF] border-2 focus-visible:ring-brand-orange',
				disabled: 'bg-[#F8F4EF] text-brand-gray-3 border-[#F8F4EF] cursor-not-allowed'
			},
			pink: {
				default:
					'bg-[#FF89C3] text-white border-[#FF89C3] hover:bg-[#FF89C3] hover:border-[#FF89C3] focus-visible:ring-brand-orange cursor-pointer',
				hover: 'bg-[#FF89C3] text-white border-[#FF89C3]',
				focused:
					'bg-[#FF89C3] text-white border-[#FF89C3] border-2 focus-visible:ring-brand-orange',
				disabled: 'bg-[#FF89C3] text-white border-[#FF89C3] cursor-not-allowed'
			},
			'golden-orange': {
				default:
					'bg-[#80808026] text-brand-dark border-[#FFB145] hover:bg-[#E89A3A] hover:border-[#E89A3A] focus-visible:ring-brand-orange cursor-pointer',
				hover: 'bg-[#80808026] text-brand-dark border-[#FFB145]',
				focused:
					'bg-[#80808026] text-brand-dark border-[#FFB145] border-2 focus-visible:ring-brand-orange',
				disabled: 'bg-[#80808026] text-brand-gray-3 border-[#FFB145] cursor-not-allowed'
			},
			transparent: {
				default:
					'bg-[#80808026] text-white border-transparent hover:bg-[#80808030] focus-visible:ring-brand-orange cursor-pointer',
				hover: 'bg-[#80808030] text-white border-transparent',
				focused:
					'bg-[#80808026] text-brand-white border-transparent border-2 focus-visible:ring-brand-orange',
				disabled: 'bg-[#80808026] text-brand-gray-3 border-transparent cursor-not-allowed'
			},
			'light-pink': {
				default:
					'bg-[#F8F8F8] text-brand-dark border-[#F8F8F8] hover:bg-[#E5E5E5] hover:border-[#E5E5E5] focus-visible:ring-brand-orange cursor-pointer',
				hover: 'bg-[#F8F8F8] text-brand-dark border-[#F8F8F8]',
				focused:
					'bg-[#F8F8F8] text-brand-dark border-[#F8F8F8] border-2 focus-visible:ring-brand-orange',
				disabled: 'bg-[#F8F8F8] text-brand-gray-3 border-[#F8F8F8] cursor-not-allowed'
			},
			white: {
				default:
					'bg-brand-white text-brand-dark border-brand-white hover:bg-brand-gray-1 hover:border-brand-gray-1 focus-visible:ring-brand-orange cursor-pointer',
				hover: 'bg-brand-gray-1 text-brand-dark border-brand-gray-1',
				focused:
					'bg-brand-white text-brand-dark border-brand-white border-2 focus-visible:ring-brand-orange',
				disabled: 'bg-brand-white text-brand-gray-3 border-brand-white cursor-not-allowed'
			}
		}[variant][effectiveState]
	);

	let allClasses = $derived(`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`);
</script>

{#if href}
	<a {href} class={allClasses}>
		{#if customIconPosition === 'right'}
			<span>{text}</span>
		{/if}
		{#if customIcon}
			{@const Icon = customIcon}
			<Icon size={iconSize ?? (size === 'sm' ? 10 : size === 'lg' ? 16 : 16)} />
		{/if}
		{#if customIconPosition === 'left'}
			<span>{text}</span>
		{/if}
	</a>
{:else}
	<button type="button" class={allClasses} disabled={isDisabled} onclick={onClick}>
		{#if customIconPosition === 'right'}
			<span>{text}</span>
		{/if}
		{#if customIcon}
			{@const Icon = customIcon}
			<Icon size={iconSize ?? (size === 'sm' ? 10 : size === 'lg' ? 16 : 16)} />
		{/if}
		{#if customIconPosition === 'left'}
			<span>{text}</span>
		{/if}
	</button>
{/if}
