import React, { useState } from 'react';

const ChatWindow = ({ onAddRecord }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [newRecord, setNewRecord] = useState(null);

  // 打开/关闭聊天窗口
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // 处理用户输入
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // 处理发送消息
  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // 添加用户消息到对话
    const userMessage = { type: 'user', content: userInput };
    setConversation([...conversation, userMessage]);
    
    // 清空输入框
    setUserInput('');
    
    // 模拟AI回复
    setTimeout(() => {
      if (!isConfirming) {
        // 第一次回复，整理成巡检问题
        const aiResponse = { 
          type: 'ai', 
          content: `我已整理您的巡检问题：\n\n问题：${userInput}\n\n位置：3号楼4层\n责任人：待指定\n状态：待整改\n\n请确认是否创建此巡检记录？` 
        };
        setConversation(prev => [...prev, aiResponse]);
        
        // 创建新记录对象
        const record = {
          id: Date.now(),
          type: '巡检问题',
          title: userInput.length > 20 ? `${userInput.substring(0, 20)}...` : userInput,
          description: userInput,
          location: '3号楼4层',
          responsible: '待指定',
          status: '待整改',
          time: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).replace(/\//g, '-')
        };
        
        setNewRecord(record);
        setIsConfirming(true);
      } else {
        // 用户已确认，添加确认消息
        const confirmMessage = { 
          type: 'ai', 
          content: '已创建巡检问题记录！' 
        };
        setConversation(prev => [...prev, confirmMessage]);
        
        // 添加新记录
        onAddRecord(newRecord);
        
        // 重置状态
        setTimeout(() => {
          setConversation([]);
          setIsConfirming(false);
          setNewRecord(null);
        }, 2000);
      }
    }, 500);
  };

  // 处理确认创建记录
  const handleConfirm = () => {
    const userConfirm = { type: 'user', content: '确认' };
    setConversation([...conversation, userConfirm]);
    handleSendMessage();
  };

  // 处理取消创建记录
  const handleCancel = () => {
    const userCancel = { type: 'user', content: '取消' };
    setConversation([...conversation, userCancel]);
    
    setTimeout(() => {
      const aiCancel = { type: 'ai', content: '已取消创建巡检问题记录。' };
      setConversation(prev => [...prev, aiCancel]);
      setIsConfirming(false);
      setNewRecord(null);
    }, 500);
  };

  return (
    <div className="chat-container">
      {/* 聊天按钮 */}
      <button className="chat-toggle" onClick={toggleChat}>
        {isOpen ? '关闭对话' : '创建巡检问题'}
      </button>
      
      {/* 聊天窗口 */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>飞书助手</h3>
            <button className="close-button" onClick={toggleChat}>×</button>
          </div>
          
          <div className="chat-messages">
            {conversation.length === 0 && (
              <div className="welcome-message">
                <p>您好！请描述您发现的巡检问题，我会帮您整理并创建记录。</p>
              </div>
            )}
            
            {conversation.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-content">
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="chat-input-container">
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="请输入巡检问题..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>发送</button>
            
            {isConfirming && (
              <div className="confirmation-buttons">
                <button onClick={handleConfirm} className="confirm-button">确认</button>
                <button onClick={handleCancel} className="cancel-button">取消</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;