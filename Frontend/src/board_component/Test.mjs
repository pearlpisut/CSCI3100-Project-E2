import stream_chat from 'stream-chat'
import { useState } from 'react'
import {useChatContext, Channel} from 'stream-chat-react'

var api_key = "2pgm4vaqzc3k"
var api_secret = "vu9n255az5jcgtmajumqvkxycaxfyqb73aewspykaxvzyyqthvbu63ukx5qnn2fk"
var userID = "9ab08d55-20ce-4cc1-8787-7bf1a59c5ac4"

server_client = stream_chat.StreamChat(api_key, api_secret)

const destroy = await server_client.deleteUser(userID);