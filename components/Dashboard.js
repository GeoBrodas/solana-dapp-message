import { useEffect, useState } from 'react'
import Message from './Message'

function Dashboard({ walletAddress }) {
  const fakeData = [
    'Hey there, nice work Pablo!',
    'Nice work macho',
    "Hey, Pablo, you're doing great!",
    'Hey, Pablo, your .. lovely!!',
  ]

  const [value, setValue] = useState('')
  const [messageList, setMessageList] = useState([])

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...')

      // Call Solana program here.

      // Set state
      setMessageList(fakeData)
    }
  }, [walletAddress])

  return (
    <div className="flex w-[100%] flex-col">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type a message"
        className="mx-auto w-[90%] rounded-xl border-2 border-gray-400 p-2 shadow-xl focus:border-red-400 md:w-[70%] lg:w-[37%]"
      />

      <button
        onClick={() => {
          setMessageList([...messageList, value])
          setValue('')
        }}
        className="btn mx-auto my-4 w-fit shadow-xl"
      >
        Submit message
      </button>

      {messageList
        .slice()
        .reverse()
        .map((message, index) => (
          <Message key={index} message={message} />
        ))}
    </div>
  )
}

export default Dashboard
