import { useEffect, useState } from 'react'
import Message from './Message'

import idl from '../utils/idl.json'
import kp from '../keypair.json'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { Program, Provider, web3 } from '@project-serum/anchor'

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3

// Create a keypair for the account that will hold the GIF data.
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address)

// Set our network to devnet.
const network = clusterApiUrl('devnet')

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: 'processed',
}

function Dashboard({ walletAddress }) {
  const fakeData = [
    'Hey there, nice work Pablo!',
    'Nice work macho',
    "Hey, Pablo, you're doing great!",
    'Hey, Pablo, your .. lovely!!',
  ]

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment)
    const provider = new Provider(
      connection,
      window.solana,
      opts.preflightCommitment
    )
    return provider
  }

  const [value, setValue] = useState('')
  const [messageList, setMessageList] = useState([])

  const getMessageList = async () => {
    try {
      const provider = getProvider()
      const program = new Program(idl, programID, provider)
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      )

      console.log('Got the account', account)
      setMessageList(account.mssgList)
    } catch (error) {
      console.log('Error in messgList: ', error)
      setMessageList(null)
    }
  }

  const createAccount = async () => {
    try {
      const provider = getProvider()
      const program = new Program(idl, programID, provider)
      console.log('ping')
      await program.rpc.initialize({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      })
      console.log(
        'Created a new BaseAccount w/ address:',
        baseAccount.publicKey.toString()
      )
      await getMessageList()
    } catch (error) {
      console.log('Error creating BaseAccount account:', error)
    }
  }

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...')

      // Call Solana program here.
      getMessageList()
    }
  }, [walletAddress])

  const renderComponent = () => {
    if (messageList === null) {
      return (
        <>
          <p className="my-4 italic text-white">
            Initialize your Solana Account to start sending messages!
          </p>
          <button onClick={createAccount} className="btn mx-auto w-1/3">
            Initialize Account 🚀
          </button>
        </>
      )
    } else {
      return (
        <>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type a message"
            className="mx-auto w-[90%] rounded-xl border-2 border-gray-400 p-2 shadow-xl focus:border-red-400 md:w-[70%] lg:w-[37%]"
          />

          <button
            onClick={async () => {
              if (value.length === 0) {
                alert('No gif link given!')
                return
              }
              setValue('')
              console.log('Message:', value)
              try {
                const provider = getProvider()
                const program = new Program(idl, programID, provider)

                await program.rpc.addMessage(value, {
                  accounts: {
                    baseAccount: baseAccount.publicKey,
                    user: provider.wallet.publicKey,
                  },
                })
                console.log('Message successfully sent to program', value)

                await getMessageList()
              } catch (error) {
                console.log('Error sending message:', error)
              }
            }}
            className="btn mx-auto my-4 w-fit shadow-xl"
          >
            Submit message
          </button>

          {messageList.length === 0 ? (
            <p className="italic text-white">No meesages found!</p>
          ) : (
            messageList
              .slice()
              .reverse()
              .map((message, index) => (
                <Message key={index} message={message.mssg} />
              ))
          )}
        </>
      )
    }
  }

  return <div className="flex w-[100%] flex-col">{renderComponent()}</div>
}

export default Dashboard
