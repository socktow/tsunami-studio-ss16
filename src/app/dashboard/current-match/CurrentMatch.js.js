"use client";

import React from 'react';
import { 
  Typography, 
  Button, 
  Card, 
  Row, 
  Col, 
  Avatar, 
  Statistic, 
  Space, 
  Divider, 
  Empty, 
  ConfigProvider, 
  theme 
} from 'antd';
import { 
  SwapOutlined, 
  ReloadOutlined, 
  MinusOutlined, 
  PlusOutlined, 
  TrophyFilled,
  UserOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const CurrentMatch = ({ currentMatch, updateScore, fetchData, handleSwap }) => {
  if (!currentMatch) {
    return (
      <div className="py-20 flex justify-center bg-black rounded-xl border border-dashed border-zinc-800">
        <Empty description={<Text className="text-zinc-500 italic">Không có trận đấu nào đang kích hoạt</Text>} />
      </div>
    );
  }

  const { tournamentName, matchType, teamsData } = currentMatch;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: '#09090b',
          borderRadius: 12,
        },
      }}
    >
      <div className="max-w-7xl mx-auto p-4 md:p-8 bg-black min-h-screen">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* FIX: Thay direction="vertical" bằng orientation="vertical" cho Space nếu antd bản này yêu cầu */}
          <Space direction="vertical" align="center" size="small">
            <div className="px-4 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
              <Space size="middle">
                <TrophyFilled className="text-yellow-500" />
                <Text className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  {tournamentName} • {matchType}
                </Text>
              </Space>
            </div>
            <Title level={1} className="!text-white !m-0 !italic !font-black uppercase tracking-tighter">
              Live Control Panel
            </Title>
          </Space>
        </div>

        <Row gutter={[48, 48]} align="middle" justify="center">
          {/* Team 1 Section */}
          <Col xs={24} lg={9}>
            <TeamDisplay 
              team={teamsData[0]} 
              index={0} 
              updateScore={updateScore} 
              isRight={false} 
            />
          </Col>

          {/* VS & Central Controls */}
          <Col xs={24} lg={6}>
            <div className="flex flex-col items-center justify-center space-y-8">
              <div className="relative">
                <Text className="text-8xl font-black italic opacity-10 text-white select-none">VS</Text>
              </div>
              
              {/* FIX: Nếu Space báo lỗi direction, dùng flexbox thuần để đảm bảo an toàn */}
              <div className="flex flex-col gap-3 w-full">
                <Button 
                  block
                  size="large"
                  icon={<SwapOutlined />}
                  onClick={handleSwap}
                  className="h-14 font-bold uppercase tracking-widest bg-white text-black border-none hover:!bg-zinc-200"
                >
                  Swap Sides
                </Button>
                <Button 
                  block
                  size="large"
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={fetchData}
                  className="text-zinc-500 hover:text-white"
                >
                  Refresh Data
                </Button>
              </div>
            </div>
          </Col>

          {/* Team 2 Section */}
          <Col xs={24} lg={9}>
            <TeamDisplay 
              team={teamsData[1]} 
              index={1} 
              updateScore={updateScore} 
              isRight={true} 
            />
          </Col>
        </Row>
      </div>

      <style jsx global>{`
        .ant-statistic-content-value { font-family: 'Monaco', monospace !important; font-weight: 900 !important; }
        .score-card { background: linear-gradient(145deg, #111111 0%, #000000 100%) !important; }
      `}</style>
    </ConfigProvider>
  );
};

const TeamDisplay = ({ team, index, updateScore, isRight }) => {
  const score = team.score || 0;

  return (
    <div className={`flex flex-col ${isRight ? 'items-start' : 'items-end'} space-y-8`}>
      <div className={`flex flex-col ${isRight ? 'items-start' : 'items-end'} gap-4`}>
        <Card 
          className="score-card border-zinc-800 shadow-2xl"
          styles={{ body: { padding: '24px' } }}
        >
          {team.logo ? (
            <img src={team.logo} alt={team.name} className="w-24 h-24 object-contain" />
          ) : (
            <Avatar size={96} shape="square" style={{ backgroundColor: team.color }} className="font-black text-3xl">
              {team.tag}
            </Avatar>
          )}
        </Card>
        <Title level={2} className="!text-white !m-0 !font-black uppercase tracking-tight">
          {team.name}
        </Title>
      </div>

      <Card 
        className="bg-zinc-900 border-zinc-800 w-full"
        styles={{ body: { padding: '8px' } }}
      >
        <div className="flex items-center justify-between">
          <Button 
            type="text"
            size="large"
            icon={<MinusOutlined />}
            onClick={() => updateScore(index, Math.max(0, score - 1))}
            className="text-zinc-500 hover:!text-red-500"
          />
          
          <Statistic 
            value={score} 
            styles={{ 
              content: { 
                color: 'white', 
                fontSize: '64px', 
                textAlign: 'center',
                textShadow: `0 0 15px ${team.color}44`
              } 
            }} 
          />

          <Button 
            type="text"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => updateScore(index, score + 1)}
            className="text-zinc-500 hover:!text-green-500"
          />
        </div>
      </Card>

      <div className="w-full max-sm:max-w-full lg:max-w-sm">
        <Divider titlePlacement={isRight ? 'left' : 'right'} className="!border-zinc-800">
          <Text className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Lineup</Text>
        </Divider>
        
        {/* Thay thế Space Lineup bằng Flexbox để tránh warning direction */}
        <div className="flex flex-col gap-2 w-full">
          {team.players?.map((p, pIdx) => (
            <div 
              key={p.id || `p-${index}-${pIdx}`} 
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-900 transition-colors ${!isRight ? 'flex-row-reverse text-right' : ''}`}
            >
              <Avatar 
                src={p.avatar} 
                icon={<UserOutlined />} 
                className="border border-zinc-800"
                style={{ minWidth: '40px' }}
              />
              <div className="overflow-hidden">
                <div className="text-zinc-200 font-bold text-sm truncate">{p.nickname}</div>
                <div className="text-[10px] uppercase font-bold" style={{ color: team.color }}>{p.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentMatch;