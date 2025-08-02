/**
 * Collaboration Chat & Comments Page
 * Author: VB Entreprise
 * 
 * Team communication with chat channels and contextual comments
 */

import React, { useState } from 'react';
import { Plus, MessageSquare, Hash, Users, Send, Paperclip, Smile } from 'lucide-react';
import CreateChannelModal from '../../components/Modals/CreateChannelModal';

interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'direct';
  members: number;
  unread: number;
  lastMessage: Date;
}

interface Message {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: Date;
  reactions: Reaction[];
  attachments?: string[];
}

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

const mockChannels: Channel[] = [
  {
    id: '1',
    name: 'general',
    type: 'public',
    members: 24,
    unread: 3,
    lastMessage: new Date('2024-01-22T14:30:00')
  },
  {
    id: '2',
    name: 'development',
    type: 'public',
    members: 8,
    unread: 0,
    lastMessage: new Date('2024-01-22T13:45:00')
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    type: 'direct',
    members: 2,
    unread: 1,
    lastMessage: new Date('2024-01-22T15:20:00')
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    user: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'The new dashboard looks great! Really impressed with the design.',
    timestamp: new Date('2024-01-22T14:30:00'),
    reactions: [{ emoji: '👍', count: 3, users: ['Mike Chen', 'Lisa Wong', 'John Doe'] }]
  },
  {
    id: '2',
    user: 'Mike Chen',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Thanks! The client feedback has been very positive too.',
    timestamp: new Date('2024-01-22T14:32:00'),
    reactions: []
  }
];

export default function ChatComments() {
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [messages] = useState<Message[]>(mockMessages);
  const [selectedChannel, setSelectedChannel] = useState<Channel>(channels[0]);
  const [newMessage, setNewMessage] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'public': return <Hash className="h-4 w-4" />;
      case 'private': return <Users className="h-4 w-4" />;
      case 'direct': return <MessageSquare className="h-4 w-4" />;
      default: return <Hash className="h-4 w-4" />;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleCreateChannel = (channelData: any) => {
    const newChannel: Channel = {
      id: channelData.id,
      name: channelData.name,
      type: channelData.type,
      members: channelData.members,
      unread: channelData.unread,
      lastMessage: channelData.lastMessage
    };
    
    setChannels(prev => [...prev, newChannel]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Chat & Comments</h1>
          <p className="mt-2 text-gray-600">
            Team communication with channels and contextual discussions.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            New Channel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Channels Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Channels</h3>
            </div>
            <div className="p-4 space-y-2">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                    selectedChannel.id === channel.id
                      ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getChannelIcon(channel.type)}
                      <span className="ml-2 text-sm font-medium">{channel.name}</span>
                    </div>
                    {channel.unread > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {channel.unread}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {channel.type !== 'direct' && `${channel.members} members • `}
                    {channel.lastMessage.toLocaleTimeString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 flex flex-col h-96">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                {getChannelIcon(selectedChannel.type)}
                <h3 className="ml-2 text-lg font-semibold text-gray-900">{selectedChannel.name}</h3>
                {selectedChannel.type !== 'direct' && (
                  <span className="ml-2 text-sm text-gray-500">
                    {selectedChannel.members} members
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={message.avatar}
                    alt={message.user}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{message.user}</span>
                      <span className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{message.content}</p>
                    {message.reactions.length > 0 && (
                      <div className="flex items-center space-x-2 mt-2">
                        {message.reactions.map((reaction, index) => (
                          <button
                            key={index}
                            className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-1 text-xs"
                          >
                            <span>{reaction.emoji}</span>
                            <span>{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message #${selectedChannel.name}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Paperclip className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Smile className="h-5 w-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Channel Modal */}
      <CreateChannelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateChannel}
      />
    </div>
  );
}