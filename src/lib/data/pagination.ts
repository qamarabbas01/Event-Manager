export const paginationUi = {
	navAriaLabel: 'Pagination',
	previousPageAriaLabel: 'Previous page',
	nextPageAriaLabel: 'Next page',
	previousButtonText: 'Back',
	nextButtonText: 'Next',
	ellipsisText: '…',
	goToPageAriaLabel: (page: number) => `Go to page ${page}`
} as const;

