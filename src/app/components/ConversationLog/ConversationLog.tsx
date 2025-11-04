import Box from '@mui/material/Box'
import styles from './ConversationLog.module.scss'
import Paper from '@mui/material/Paper'
import { Message } from '@/app/types/global'

type ConversationLogProps = {
	messages: Message[]
}

const ConversationLog = ({ messages }: ConversationLogProps) => {
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

export default ConversationLog
