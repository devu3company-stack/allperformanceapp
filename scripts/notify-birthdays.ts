import { findBirthdayNotifications } from '../lib/birthdays'

async function main() {
  const notifications = await findBirthdayNotifications(new Date())

  if (notifications.length === 0) {
    console.log('Nenhum aniversariante para avisar hoje.')
    return
  }

  console.log(`Aniversariantes para avisar hoje: ${notifications.length}`)

  notifications.forEach((notification) => {
    console.log(`- ${notification.message}`)
  })
}

main()
  .catch((error) => {
    console.error('Erro ao gerar avisos de aniversário:', error)
    process.exit(1)
  })
