import { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { useStoreon } from 'storeon/react'
import { ChatItemScreenProps } from "../types";
import Loader from "../../components/Loader";
import socket from "../../utils/socket";
import { SOCKET_EVENTS } from "../../const";
import { Events, States } from "../../store";

const ChatItem = ({ route }: ChatItemScreenProps) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputData, setInputData] = useState('')
  const { profileData } = useStoreon<States, Events>('profileData')

  const onSubmit = () => {
    if(!profileData || !inputData) return
    socket.emit(SOCKET_EVENTS.sendMessage, { text: inputData, authorId: profileData.id })
    setInputData('')
  }

  useEffect(() => {
    setIsLoading(true);
    socket.emit(SOCKET_EVENTS.receiveRoomMessages, {
      orderId: route.params.orderId,
    });
    socket.on(SOCKET_EVENTS.receiveRoomMessages, (data) => {
      setMessages(data)
    })
    setIsLoading(false);

    return () => {
      socket.off(SOCKET_EVENTS.receiveRoomMessages)
    }
  }, []);

  if (isLoading) return <Loader />;
  return (
    <View>
      <Text>CHAT 1</Text>
    </View>
  );
};

export default ChatItem;
