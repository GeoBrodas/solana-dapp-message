function Message({ message, txId }) {
  return (
    <div className="glass mx-auto my-4 w-[90%] p-4 text-white md:w-[70%] lg:w-[57%]">
      <p className="text-left font-mono text-lg">{message}</p>
      <p className="text-right font-mono text-lg font-bold italic underline">
        View on SOlExplorer
      </p>
    </div>
  )
}

export default Message
