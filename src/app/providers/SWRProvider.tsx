'use client'

import { ReactNode } from 'react'
import { SWRConfig } from 'swr'

const SWRProvider = ({ children }: { children: ReactNode }) => {
	return (
		<SWRConfig
			value={{
				fetcher: (url: string) => fetch(url).then((res) => res.json()),
				dedupingInterval: 10000, // 10s cache for identical requests
				revalidateOnFocus: false, // no refetch on window focus
			}}
		>
			{children}
		</SWRConfig>
	)
}

export default SWRProvider
