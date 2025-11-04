import Box from '@mui/material/Box'
import styles from './chatHistory.module.scss'
import Paper from '@mui/material/Paper'
import { Message } from '@/app/types/global'

type ChatHistoryProps = {
	messages: Message[]
}

const ChatHistory = ({ messages }: ChatHistoryProps) => {
	return (
		<Paper variant="outlined" className={styles.messagesContainer}>
			<Box>
				{messages.map((msg, index) => (
					<Box
						key={index}
						className={`${styles.message}
									${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
					>
						<strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
					</Box>
				))}
			</Box>
		</Paper>
	)
}

export default ChatHistory
