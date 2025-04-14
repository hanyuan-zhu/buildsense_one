import React, { useState } from 'react';
import './Dashboard.css';
import ChatWindow from './ChatWindow';
import './ChatWindow.css';

const Dashboard = () => {
  // 事件卡片数据
  const initialRecords = [
    {
      id: 1,
      type: '巡检问题',
      title: '钢筋间距不符合规范要求',
      description: '现场检查发现部分区域钢筋间距大于设计要求150mm，最大处达到180mm。',
      location: '3号楼2层梁板',
      responsible: '张工',
      status: '待整改',
      time: '2023-05-15 09:30'
    },
    {
      id: 2,
      type: '旁站记录',
      title: '混凝土浇筑旁站',
      description: '全程监督3号楼3层混凝土浇筑过程，坍落度检测合格，浇筑过程规范。',
      location: '3号楼3层',
      responsible: '李监理',
      status: '已完成',
      time: '2023-05-16 14:00'
    },
    {
      id: 3,
      type: '验收记录',
      title: '防水层验收',
      description: '地下室防水层施工完成，经闭水试验无渗漏，符合验收标准。',
      location: '地下室',
      responsible: '王监理',
      status: '已验收',
      time: '2023-05-17 10:15'
    }
  ];
  
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCard, setSelectedCard] = useState(null);
  const [logType, setLogType] = useState('监理日志');
  const [selectedCards, setSelectedCards] = useState([]);
  const [records, setRecords] = useState(initialRecords);
  
  // 添加新记录的处理函数
  const handleAddRecord = (newRecord) => {
    setRecords([newRecord, ...records]);
  };
  
  // 日志类型选项
  const logTypes = ['监理日志', '巡检记录', '旁站记录', '监理通知单'];
  
  // 日志模板
  const logTemplates = {
    '监理日志': '监理日志模板内容...',
    '巡检记录': '巡检记录模板内容...',
    '旁站记录': '旁站记录模板内容...',
    '监理通知单': '监理通知单模板内容...'
  };

  const filteredRecords = activeTab === 'all' 
    ? records 
    : records.filter(record => record.type === activeTab);

  return (
    <div className="dashboard">
      <div className="header">
        <h1>巡检记录看板</h1>
        <div className="tabs">
          <button 
            className={activeTab === 'all' ? 'active' : ''} 
            onClick={() => {
              setActiveTab('all');
              setSelectedCard(null);
            }}
          >
            全部
          </button>
          <button 
            className={activeTab === '巡检问题' ? 'active' : ''} 
            onClick={() => setActiveTab('巡检问题')}
          >
            巡检问题
          </button>
          <button 
            className={activeTab === '旁站记录' ? 'active' : ''} 
            onClick={() => setActiveTab('旁站记录')}
          >
            旁站记录
          </button>
          <button 
            className={activeTab === '验收记录' ? 'active' : ''} 
            onClick={() => setActiveTab('验收记录')}
          >
            验收记录
          </button>
        </div>
      </div>

      <div className="log-generator">
        <select 
          value={logType}
          onChange={(e) => setLogType(e.target.value)}
        >
          {logTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <button 
          onClick={() => {
            const selectedRecords = records.filter(record => 
              selectedCards.includes(record.id)
            );
            alert(`生成${logType}，基于${selectedRecords.length}条记录:\n${logTemplates[logType]}`);
          }}
          disabled={selectedCards.length === 0}
        >
          生成日志
        </button>
      </div>

      <div className="records-container">
        {filteredRecords.map(record => (
          <div 
            key={record.id} 
            className={`record-card ${selectedCards.includes(record.id) ? 'selected' : ''}`}
            onClick={() => {
              setSelectedCards(prev => 
                prev.includes(record.id) 
                  ? prev.filter(id => id !== record.id)
                  : [...prev, record.id]
              );
            }}
          >
            <div className="card-header">
              <span className={`type-badge ${record.type}`}>{record.type}</span>
              <span className="time">{record.time}</span>
            </div>
            <h3>{record.title}</h3>
            <p>{record.description}</p>
            <div className="card-footer">
              <span>部位: {record.location}</span>
              <span>责任人: {record.responsible}</span>
              <span>状态: {record.status}</span>
            </div>
            <input 
              type="checkbox" 
              checked={selectedCards.includes(record.id)}
              onChange={() => {}}
              onClick={(e) => e.stopPropagation()}
              className="card-checkbox"
            />
          </div>
        ))}
      </div>
      
      {/* 添加聊天窗口组件 */}
      <ChatWindow onAddRecord={handleAddRecord} />
    </div>
  );
};

export default Dashboard;