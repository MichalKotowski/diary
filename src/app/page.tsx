'use client'

import Container from '@mui/material/Container'
import { Chat } from '@/components'

const Home = () => {
	return (
		<main>
			<Container maxWidth="sm">
				<Chat />
			</Container>
		</main>
	)
}

export default Home
