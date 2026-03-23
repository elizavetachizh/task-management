export default function ErrorState({ error }: { error: Error }) {
    return <div>Ошибка при загрузке задач: {error.message}</div>
}