// this component receives a string and types it out letter by letter
function Typewriter({ text }: { text: string }) {
    return (
        <span>{text}</span>
    )
}

export default Typewriter