import styles from './ConversationSummary.module.scss'

type ConversationSummaryProps = {
	summary?: string
}

const ConversationSummary = ({ summary }: ConversationSummaryProps) => {
	if (!summary) return

	// Temporary visibility
	return (
		<div className={styles.summaryWrapper}>
			<h3>Summary</h3>
			<p>{summary}</p>
		</div>
	)
}

export default ConversationSummary
