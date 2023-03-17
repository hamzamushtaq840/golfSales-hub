import React from 'react'
import { useNavigate } from 'react-router-dom'
import user from './../assets/user.svg'


const Messages = () => {
    const navigate = useNavigate()
    let chats = [
        {
            chatId: '12912981212',
            recieverName: 'Fred',
            recieverImage: user,
            lastText: "I have a question about",
            lastTextTime: '12-03-2023T22:04',
            read: true
        },
        {
            chatId: '129as12981212',
            recieverName: 'Fred',
            recieverImage: user,
            lastTextTime: '12-03-2023T22:04',
            lastText: "Okej great, I just got the parcel",
            read: false
        },
        {
            chatId: '1291298a1212',
            recieverName: 'Fred',
            recieverImage: user,
            lastTextTime: '12-03-2023T22:04',
            lastText: "Okej great, I just got the parcel",
            read: false
        },
        {
            chatId: '1291298121s2',
            recieverName: 'Fred',
            recieverImage: user,
            lastTextTime: '12-03-2023T22:04',
            lastText: "Okej great, I just got the parcel",
            read: false
        }
    ]


    const handleSingleChat = (id) => {
        navigate("/messages/chat", { state: { chatId: id } })
    }

    return (
        <div className='pl-[23px] min-h-[90vh]'>
            <h1 className='mt-[7px] text-[20px] font-[700] mb-[14px]'>Messages</h1>
            <div className='flex flex-col gap-[18px]'>
                {chats.map((value, index) => {
                    return (
                        <div className='flex items-center cursor-pointer' onClick={() => handleSingleChat(value.chatId)}>
                            <div className='h-[50px] w-[50px] mr-[26px]'>
                                <img src={user} alt="userImage" />
                            </div>
                            <div className='flex flex-col flex-1 '>
                                <h1 className='text-[12px] text-[#595959] font-[700] mb-[5px]'>{value.recieverName}</h1>
                                <p className={`text-[12px] text-[#000000]  mb-[10px] ${value.read ? "font-[700]" : "font-[500]"} `}>{value.lastText}</p>
                                <p className='text-[8px] font-[500] text-[#595959Bbf] mb-[5px]'>{value.lastTextTime}</p>
                                {index + 1 !== chats.length && <div className='p-[0.5px]  bg-[#595959]'></div>}
                            </div>
                        </div>)
                })}
            </div>




        </div>
    )
}

export default Messages