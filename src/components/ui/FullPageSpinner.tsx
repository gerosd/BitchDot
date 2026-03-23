import { Spinner } from 'flowbite-react'

export const FullPageSpinner = () => {
	return (
		<div className='flex items-center justify-center h-full'>
			 <Spinner aria-label='Загрузка...' size='xl' />
		</div>
	)
}
