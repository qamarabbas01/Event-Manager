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
	type rounded = 'none' | 'full' | 'lg' | 'md' | 'sm' | 'xs';

	interface Props {
		text?: string;
		variant?: ButtonVariant;
		size?: ButtonSize;
		state?: ButtonState;
		disabled?: boolean;
		class?: string;
		rounded?: rounded;
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
		rounded = 'full',
		href,
		customIcon,
		customIconPosition = 'left',
		iconSize,
		onClick
	}: Props = $props();

	let isDisabled = $derived(disabled || state === 'disabled');
	let effectiveState = $derived(isDisabled ? 'disabled' : state);

	let baseClasses = $derived(
		'inline-flex items-center justify-center gap-2 border transition-all focus-visible:outline-none focus-visible:ring-3'
	);

	let roundedClasses = $derived(
		{
			none: 'rounded-none',
			full: 'rounded-full',
			lg: 'rounded-lg',
			md: 'rounded-md',
			sm: 'rounded-sm',
			xs: 'rounded-xs'
		}[rounded]
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
				default: 'bg-white text-black border-gray-200 hover:bg-gray-100 hover:border-gray-200 cursor-pointer',
				hover: 'bg-gray-100 text-black border-gray-200',
				focused: 'bg-white text-black border-white border-2',
				disabled: 'bg-white text-gray-400 border-gray-200 cursor-not-allowed'
			},
			'primary-orange': {
				default:
					'bg-orange-500 text-black border-orange-500 hover:bg-orange-600 hover:border-orange-600 cursor-pointer',
				hover: 'bg-orange-600 text-black border-orange-600',
				focused: 'bg-orange-500 text-black border-orange-500 border-2',
				disabled: 'bg-orange-200 text-black border-orange-200 cursor-not-allowed'
			},
			'primary-blue': {
				default:
					'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600 cursor-pointer',
				hover: 'bg-blue-600 text-white border-blue-600',
				focused: 'bg-blue-500 text-white border-blue-500 border-2',
				disabled: 'bg-blue-200 text-white border-blue-200 cursor-not-allowed'
			},
			secondary: {
				default:
					'bg-blue-800 text-orange-300 border-blue-800 hover:bg-blue-900 hover:border-blue-900 cursor-pointer',
				hover: 'bg-blue-900 text-orange-300 border-blue-900',
				focused: 'bg-blue-800 text-orange-300 border-blue-800 border-2',
				disabled: 'bg-blue-800 text-orange-300 border-blue-800 cursor-not-allowed'
			},
			'tertiary-white': {
				default:
					'bg-white text-black border-gray-200 hover:bg-gray-100 hover:border-gray-200 cursor-pointer',
				hover: 'bg-gray-100 text-black border-gray-200',
				focused: 'bg-white text-black border-white border-2',
				disabled: 'bg-white text-gray-400 border-gray-200 cursor-not-allowed'
			},
			'tertiary-blue': {
				default:
					'bg-white text-blue-500 border-gray-200 hover:bg-gray-100 hover:border-gray-200 cursor-pointer',
				hover: 'bg-gray-100 text-blue-500 border-gray-200',
				focused: 'bg-white text-blue-500 border-white border-2',
				disabled: 'bg-white text-gray-400 border-gray-200 cursor-not-allowed'
			},
			'neutral-gray': {
				default:
					'bg-gray-400 text-white border-gray-400 hover:bg-gray-600 hover:border-gray-600 cursor-pointer',
				hover: 'bg-gray-600 text-white border-gray-600',
				focused: 'bg-gray-400 text-white border-white border-2',
				disabled: 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
			},
			'light-gray': {
				default:
					'bg-gray-200 text-black border-gray-200 hover:bg-gray-300 hover:border-gray-300 cursor-pointer',
				hover: 'bg-gray-300 text-black border-gray-300',
				focused: 'bg-gray-200 text-black border-white border-2',
				disabled: 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
			},
			sand: {
				default:
					'bg-[#F8F4EF] text-black border-[#F8F4EF] hover:bg-[#F3EEE4] hover:border-[#F3EEE4] cursor-pointer',
				hover: 'bg-[#F3EEE4] text-black border-[#F3EEE4]',
				focused: 'bg-[#F8F4EF] text-black border-[#F8F4EF] border-2',
				disabled: 'bg-[#F8F4EF] text-gray-400 border-[#F8F4EF] cursor-not-allowed'
			},
			pink: {
				default:
					'bg-[#FF89C3] text-white border-[#FF89C3] hover:bg-[#FF6FAF] hover:border-[#FF6FAF] cursor-pointer',
				hover: 'bg-[#FF6FAF] text-white border-[#FF6FAF]',
				focused: 'bg-[#FF89C3] text-white border-[#FF89C3] border-2',
				disabled: 'bg-[#FF89C3] text-white border-[#FF89C3] cursor-not-allowed'
			},
			'golden-orange': {
				default:
					'bg-[#80808026] text-black border-[#FFB145] hover:bg-[#E89A3A] hover:border-[#E89A3A] cursor-pointer',
				hover: 'bg-[#E89A3A] text-black border-[#E89A3A]',
				focused: 'bg-[#80808026] text-black border-[#FFB145] border-2',
				disabled: 'bg-[#80808026] text-gray-400 border-[#FFB145] cursor-not-allowed'
			},
			transparent: {
				default:
					'bg-transparent text-white border-transparent hover:bg-gray-100 cursor-pointer',
				hover: 'bg-gray-100 text-white border-transparent',
				focused: 'bg-transparent text-white border-transparent border-2',
				disabled: 'bg-transparent text-gray-400 border-transparent cursor-not-allowed'
			},
			'light-pink': {
				default:
					'bg-[#F8F8F8] text-black border-[#F8F8F8] hover:bg-[#E5E5E5] hover:border-[#E5E5E5] cursor-pointer',
				hover: 'bg-[#E5E5E5] text-black border-[#E5E5E5]',
				focused: 'bg-[#F8F8F8] text-black border-[#F8F8F8] border-2',
				disabled: 'bg-[#F8F8F8] text-gray-400 border-[#F8F8F8] cursor-not-allowed'
			},
			white: {
				default:
					'bg-white text-black border-white hover:bg-gray-100 hover:border-gray-100 cursor-pointer',
				hover: 'bg-gray-100 text-black border-gray-100',
				focused: 'bg-white text-black border-white border-2',
				disabled: 'bg-white text-gray-400 border-white cursor-not-allowed'
			}
		}[variant][effectiveState]
	);

	let allClasses = $derived(
		`${baseClasses} ${sizeClasses} ${variantClasses} ${roundedClasses} ${className}`
	);
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
